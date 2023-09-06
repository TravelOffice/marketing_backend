import omit from 'lodash/omit';
import { userRepository } from '../repositories';
import { OMITTED_USER_ATTRIBUTES } from '../utils/constants';
import { GetTenantUserWithPermissionUseCase } from './interfaces/GetTenantUserWithPermissionUseCase';

export default class GetTenantUserWithPermissionUseCaseImpl
implements GetTenantUserWithPermissionUseCase {
  /**
   * Method to get single user belong to Tenant which determine by userId
   * To get Tenant user, there are steps need to do:
   * - Step 1: Confirm the user information existed in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: Get the tenant user
   * @param tenantId The id of tenant
   * @param userId The id of retrieve user
   * @returns Promise<User> All information of tenant user with permission and search token
   */
  invoke = async (tenantId: string, userId: string) => {
    const user = await userRepository.getWithPermission(tenantId, userId);
    if (!user) throw new Error(`Tenant [${tenantId}] User [${userId}] does not exist!`);
    return omit(user, OMITTED_USER_ATTRIBUTES);
  };
}
