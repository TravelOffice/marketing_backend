import { marketplaceUserRepository } from '../repositories';
import { EnableMarketplaceUserUseCase } from './interfaces/EnableMarketplaceUserUseCase';
import { MarketplaceUser } from '../models';

export default class EnableMarketplaceuserUseCaseImpl implements EnableMarketplaceUserUseCase {
  /**
   * Enable or disable a MarketplaceUser based on tenant and username.
   *
   * @param {string} tenant - The tenant ID.
   * @param {string} username - The username of the user.
   * @param {boolean} enable - The new enable status.
   * @throws {Error} - If the user does not exist.
   */
  invoke = async (
    userId: string,
    enable: boolean,
  ): Promise<MarketplaceUser> => {
    // Retrieve the user using the constructed ID
    const user = await marketplaceUserRepository.getById(userId);

    // If user doesn't exist, throw an error
    if (!user) {
      throw new Error('User does not exist');
    }

    // Enable or disable the user
    return marketplaceUserRepository.update(userId, { enable } as Partial<MarketplaceUser>);
  };
}
