import { CreateMarketplaceUserUseCase } from './interfaces/CreateMarketplaceUserUseCase';
import { marketplaceUserRepository, travelUserRepository } from '../repositories';
import { UserWithRoles } from '../models';

export default class CreateMarketplaceUserUseCaseImpl implements CreateMarketplaceUserUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @returns Promise<MarketplaceUser> The created marketplace user
   * @param tenant The ID of tenant
   * @param user The user that contain roles
   */
  invoke = async (tenant: string, user: UserWithRoles) => {
    // Retrieve user information from travel table
    const travelUser = await travelUserRepository.get(tenant, user.username);
    if (!travelUser) throw new Error('User does not exist');
    // Check marketplace user exists or not
    const existedUser = await marketplaceUserRepository.getById(`${tenant}#${user.username}`);
    if (existedUser) return existedUser;
    return marketplaceUserRepository.add(tenant, user);
  };
}
