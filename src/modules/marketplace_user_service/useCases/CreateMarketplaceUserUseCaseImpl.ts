import { CreateMarketplaceUserUseCase } from './interfaces/CreateMarketplaceUserUseCase';
import { marketplaceUserRepository } from '../repositories';
import { UserWithRoles } from '../models';

export default class CreateMarketplaceUserUseCaseImpl implements CreateMarketplaceUserUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @returns Promise<MarketplaceUser> The created marketplace user
   * @param tenant The ID of tenant
   * @param users The users that contain roles
   */
  invoke = async (tenant: string, users: UserWithRoles | UserWithRoles[]) => {
    if (!users) throw new Error('User is invalid');
    if (Array.isArray(users)) {
      const marketplaceUsers = users.map(
        (user) => marketplaceUserRepository.buildBatchWriteUser(tenant, user),
      );
      const validUsers = marketplaceUsers.filter(async (user) => {
        // Check marketplace user exists or not
        const marketplaceUser = await marketplaceUserRepository.getById(`${tenant}#${user.username}`);
        if (marketplaceUser) return false;
        return true;
      });
      const unprocessedUsers = await marketplaceUserRepository.executeBatchWrite(validUsers);
      return {
        processedUsers: validUsers,
        unprocessedUsers,
      };
    }
    // Check marketplace user exists or not
    const existedUser = await marketplaceUserRepository.getById(`${tenant}#${users.username}`);
    if (existedUser) return existedUser;
    const marketplaceUser = marketplaceUserRepository.buildBatchWriteUser(tenant, users);
    return marketplaceUserRepository.add(marketplaceUser);
  };
}
