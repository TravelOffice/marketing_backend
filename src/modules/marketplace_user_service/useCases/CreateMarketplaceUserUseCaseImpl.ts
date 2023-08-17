import { CreateMarketplaceUserUseCase } from './interfaces/CreateMarketplaceUserUseCase';
import { marketplaceUserRepository, travelUserRepository } from '../repositories';

export default class CreateMarketplaceUserUseCaseImpl implements CreateMarketplaceUserUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @returns Promise<MarketplaceUser> The created marketplace user
   * @param tenant The ID of tenant
   * @param username The username in cognito
   * @param roles The roles of marketplace user
   */
  invoke = async (tenant: string, username: string, roles: string[]) => {
    // Retrieve user information from travel table
    const travelUser = await travelUserRepository.get(tenant, username);
    if (!travelUser) throw new Error('User does not exist');
    // Check marketplace user exists or not
    const marketplaceUser = await marketplaceUserRepository.getById(`${tenant}#${username}`);
    if (marketplaceUser) return marketplaceUser;
    return marketplaceUserRepository.add(travelUser, roles);
  };
}
