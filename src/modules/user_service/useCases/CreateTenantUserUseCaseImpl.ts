import omit from 'lodash/omit';
import {
  LANGUAGES_TYPE,
  THEMES_TYPE,
  User,
} from '../models';
import { rolePermissionRepository, userRepository } from '../repositories';
import { OMITTED_USER_ATTRIBUTES } from '../utils/constants';
import { CreateTenantUserUseCase } from './interfaces/CreateTenantUserUseCase';

export default class CreateTenantUserUseCaseImpl implements CreateTenantUserUseCase {
  /**
   * Method to create Tenant user
   * To create Tenant user, there are steps need to do:
   * - Step 1: Confirm the update user information exists in Dynamo DB
   * - Step 2: Verify whether input user roles existed or not
   * - Step 3: Create the user with the default settings
   * @param tenantId The id of the tenant
   * @param user The user information to be created
   * @returns Promise<User> All information of created user
   */
  invoke = async (tenantId: string, user: User) => {
    // Confirm user does not exist
    const existingUser = await userRepository.getUserAttributes(tenantId, user.username);
    if (existingUser) throw new Error(`User [${user.username}] already existed!`);

    // Verify whether input user roles existed or not
    const customRoles = await rolePermissionRepository.listRoles(tenantId);
    const defaultRoles = await rolePermissionRepository.listDefaultRoles();
    const roles = customRoles.concat(defaultRoles);
    user.roles.forEach((userRole) => {
      const ret = roles.some((role) => role.name === userRole);
      if (!ret) throw new Error(`Role [${userRole}] is not existed!`);
      return ret;
    });

    const newUser: User = {
      ...user,
      username: user.username,
      tenant: tenantId,
      roles: user.roles,
      settings: {
        theme: THEMES_TYPE.LIGHT,
        language: LANGUAGES_TYPE.VIETNAMESE,
      },
      wct: false,
    };

    const ddbUser = await userRepository.create(tenantId, newUser);
    return omit(ddbUser, OMITTED_USER_ATTRIBUTES);
  };
}
