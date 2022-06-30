import { userRepository } from '../repositories';
import { GetTenantUserUseCase } from './interfaces/GetTenantUserUseCase';

export default class GetTenantUserUseCaseImpl implements GetTenantUserUseCase {
  /**
   * Method to get single user belong to Tenant which determine by userId
   * To get Tenant user, there are steps need to do:
   * - Step 1: Confirm the user information existed in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: Get the tenant user
   * @param userId The id of retrieve user
   * @returns Promise<User> All information of tenant user
   */
  invoke = async (userId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error(`Your account [${userId}] not existed!`);

    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error(`User [${userId}] is missing tenant attribute`);

    const user = await userRepository.get(tenantId, userId);
    if (!user) throw new Error(`Tenant [${tenantId}] User [${userId}] does not exist!`);

    return user;
  };
}
