import { userRepository } from '../repositories';
import { GetTenantUserUseCase } from './interfaces/GetTenantUserUseCase';

export default class GetTenantUserUseCaseImpl implements GetTenantUserUseCase {
  /**
   * Method to get single user belong to Tenant which determine by userId
   * To get Tenant user, there are steps need to do:
   * - Step 1: Confirm the user information existed in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: Get the tenant user
   * @param tenantId The id of tenant
   * @param userId The id of retrieve user
   * @returns Promise<User> All information of tenant user
   */
  invoke = async (tenantId: string, userId: string) => {
    const user = await userRepository.get(tenantId, userId);
    if (!user) throw new Error(`Tenant [${tenantId}] User [${userId}] does not exist!`);

    return user;
  };
}
