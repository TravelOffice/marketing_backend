import { CreateMultiMarketplaceUserUseCase } from './interfaces/CreateMultiMarketplaceUserUseCase';
import { marketplaceUserRepository } from '../repositories';
import { UserWithRoles } from '../models';

export default class CreateMarketplaceUserUseCaseImpl
implements CreateMultiMarketplaceUserUseCase {
  /**
   * Method to get all users belong to Tenant excepts Root account
   * @returns Promise<MarketplaceUser> The created marketplace user
   * @param tenant The ID of tenant
   * @param users The users that contain roles
   */
  invoke = async (tenant: string, users: UserWithRoles[]) => {
    // Get user by Id
    const fetchedUsers = await Promise.all(
      users.map(async (user) => {
        const existedUser = await marketplaceUserRepository.getById(
          `${tenant}#${user.username}`,
        );
        return {
          user,
          existedUser,
        };
      }),
    );
    // Check marketplace user exists or not
    const validUsers = fetchedUsers
      .filter((data) => {
        if (data.existedUser) return false;
        return true;
      })
      .map((data) => data.user);

    return marketplaceUserRepository.buildBatchWriteUser(tenant, validUsers);
  };
}
