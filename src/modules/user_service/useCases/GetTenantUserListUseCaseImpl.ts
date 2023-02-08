import omit from 'lodash/omit';
import { User } from '../models';
import { userRepository } from '../repositories';
import { OMITTED_USER_ATTRIBUTES, ROOT_ROLE } from '../utils/constants';
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
  invoke = async (tenantId: string) => {
    const users = await userRepository.list(tenantId);
    // Remove root user
    const filteredUsers = users.filter((user: User) => !user.roleStr.includes(ROOT_ROLE));
    return filteredUsers.map((user) => omit(user, OMITTED_USER_ATTRIBUTES));
  };
}
