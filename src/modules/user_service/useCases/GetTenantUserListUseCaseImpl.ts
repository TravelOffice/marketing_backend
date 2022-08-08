import { userRepository } from '../repositories';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';

export default class GetTenantUserListUseCaseImpl implements GetTenantUserListUseCase {
  /**
   * Method to get all users belong to Tenant
   * To get all Tenant users, there are steps need to do:
   * - Step 1: Confirm the authenticated user information exists in Dynamo DB
   * - Step 2: Get the current tenant from authenticated user
   * - Step 3: Get all tenant users
   * @param tenantId The id of the Tenant
   * @returns Promise<User> All information of list tenant user
   */
  invoke = async (tenantId: string) => userRepository.list(tenantId);
}
