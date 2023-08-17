import { helper } from 'core';
import { MarketplaceUser } from '../models';
import { GetTenantUserListUseCase } from './interfaces/GetTenantUserListUseCase';
import { marketplaceUserRepository } from '../repositories';

export default class GetTenantUserListUseCaseImpl implements GetTenantUserListUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @param tenantId The id of the Tenant
   * @returns Promise<User> All information of list tenant user
   */
  invoke = async (tenantId: string) => {
    const users = await marketplaceUserRepository.list(tenantId);
    // Remove root user
    return users.map((user) => helper.excludeDataFromObject(user) as MarketplaceUser);
  };
}
