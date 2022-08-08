import { User } from '../models/User';
import { userRepository } from '../repositories';
import { UpdateTenantUserUseCase } from './interfaces/UpdateTenantUserUseCase';

export default class UpdateTenantUserUseCaseImpl implements UpdateTenantUserUseCase {
  /**
   * Method to update Tenant user
   * To update Tenant user, there are steps need to do:
   * - Step 1: Confirm the authenticated user information exists in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: Check whether user to be updated exists or not
   * - Step 4: Update the user
   * @param tenantId The id of the tenant
   * @param userId The id of user to be updated
   * @param user The user information to be updated
   * @returns Promise<User> All information of updated user
   */
  invoke = async (tenantId: string, userId: string, user: User) => {
    // Confirm user does not exist
    const oldUser = await userRepository.getUserAttributes(tenantId, userId);
    if (!oldUser) throw new Error(`Tenant [${tenantId}] User [${userId}] does not exist!`);

    const newUser: User = {
      ...oldUser,
      ...user,
      username: userId,
      tenant: tenantId,
      roles: user.roles,
      createdAt: oldUser.createdAt,
      settings: {
        language: user.settings?.language || oldUser.settings?.language,
        theme: user.settings?.theme || oldUser.settings?.theme,
      },
    };

    const updatedUser = await userRepository.update(tenantId, newUser);
    const {
      pk, sk, typeLsi, ...rest
    } = updatedUser as any;

    return rest as User;
  };
}
