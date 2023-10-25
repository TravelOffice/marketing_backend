import omit from 'lodash/omit';
import { User } from '../models';
import { rolePermissionRepository, userRepository } from '../repositories';
import { OMITTED_USER_ATTRIBUTES } from '../utils/constants';
import { UpdateTenantUserUseCase } from './interfaces/UpdateTenantUserUseCase';
import { reformatPhoneNumber } from '../utils/utils';

export default class UpdateTenantUserUseCaseImpl implements UpdateTenantUserUseCase {
  /**
   * Method to update Tenant user
   * To update Tenant user, there are steps need to do:
   * - Step 1: Confirm the update user information exists in Dynamo DB
   * - Step 2: Verify whether input user roles existed or not
   * - Step 3: Update the user
   * @param tenantId The id of the tenant
   * @param userId The id of user to be updated
   * @param user The user information to be updated
   * @returns Promise<User> All information of updated user
   */
  invoke = async (tenantId: string, userId: string, user: User) => {
    // Confirm user does not exist
    const oldUser = await userRepository.getUserAttributes(tenantId, userId);
    if (!oldUser) throw new Error(`Tenant [${tenantId}] User [${userId}] does not exist!`);

    // Verify whether input user roles existed or not
    if (user.roles) {
      const customRoles = await rolePermissionRepository.listRoles(tenantId);
      const defaultRoles = await rolePermissionRepository.listDefaultRoles();
      const roles = customRoles.concat(defaultRoles);
      user.roles.forEach((userRole) => {
        const ret = roles.some((role) => role.name === userRole);
        if (!ret) throw new Error(`Role [${userRole}] is not existed!`);
        return ret;
      });
    }

    const newUser: User = {
      ...oldUser,
      ...user,
      phoneNumber: reformatPhoneNumber(user.phoneNumber || oldUser.phoneNumber),
      username: userId,
      tenant: tenantId,
      roles: user.roles || oldUser.roles,
      createdAt: oldUser.createdAt,
      settings: {
        language: user.settings?.language || oldUser.settings?.language,
        theme: user.settings?.theme || oldUser.settings?.theme,
      },
    };

    const updatedUser = await userRepository.update(tenantId, newUser);

    return omit(updatedUser, OMITTED_USER_ATTRIBUTES);
  };
}
