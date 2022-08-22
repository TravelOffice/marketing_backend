import omit from 'lodash/omit';
import {
  LANGUAGES_TYPE,
  ROLES_TYPE,
  THEMES_TYPE,
  User,
} from '../models/User';
import { userRepository } from '../repositories';
import { OMITTED_USER_ATTRIBUTES } from '../utils/constants';
import { CreateTenantUserUseCase } from './interfaces/CreateTenantUserUseCase';

export default class CreateTenantUserUseCaseImpl implements CreateTenantUserUseCase {
  /**
   * Method to create Tenant user
   * To create Tenant user, there are steps need to do:
   * - Step 1: Confirm the authenticated user information exists in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: TODO check the permission of authenticated user
   * - Step 4: Check whether user to be created exists or not
   * - Step 5: Create the user with the default settings
   * @param tenantId The id of the tenant
   * @param user The user information to be created
   * @returns Promise<User> All information of created user
   */
  invoke = async (tenantId: string, user: User) => {
    // Confirm user does not exist
    const existingUser = await userRepository.getUserAttributes(tenantId, user.username);
    if (existingUser) throw new Error(`User [${user.username}] already existed!`);

    const newUser: User = {
      ...user,
      username: user.username,
      tenant: tenantId,
      roles: user.roles || [ROLES_TYPE.EMPLOYEE],
      settings: {
        theme: THEMES_TYPE.LIGHT,
        language: LANGUAGES_TYPE.VIETNAMESE,
      },
    };

    const ddbUser = await userRepository.create(tenantId, newUser);
    return omit(ddbUser, OMITTED_USER_ATTRIBUTES);
  };
}
