import { helper } from 'core';
import { travelUserRepository } from '../repositories';
import { GetMarketplaceUserUseCase } from './interfaces/GetMarketplaceUserUseCase';
import { MarketplaceUser } from '../models';

export default class GetMarketplaceUserUseCaseImpl implements GetMarketplaceUserUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @returns Promise<MarketplaceUser> The created marketplace user
   * @param tenant The ID of tenant
   * @param username The username in cognito
   */
  invoke = async (tenant: string, username: string) => {
    // Retrieve user information from travel table
    const travelUser = await travelUserRepository.get(tenant, username);
    if (!travelUser) throw new Error('User does not exist');
    return helper.excludeDataFromObject(travelUser) as MarketplaceUser;
  };
}
