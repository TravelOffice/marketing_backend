import { helper } from 'core';
import { marketplaceUserRepository } from '../repositories';
import { GetMarketplaceUserUseCase } from './interfaces/GetMarketplaceUserUseCase';
import { MarketplaceUser } from '../models';

export default class GetMarketplaceUserUseCaseImpl implements GetMarketplaceUserUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @returns Promise<MarketplaceUser> The created marketplace user
   * @param id The ID of the marketplace user
   */
  invoke = async (id: string) => {
    // Retrieve user information from travel table
    const travelUser = await marketplaceUserRepository.getById(id);
    if (!travelUser) throw new Error('User does not exist');
    return helper.excludeDataFromObject(travelUser) as MarketplaceUser;
  };
}
