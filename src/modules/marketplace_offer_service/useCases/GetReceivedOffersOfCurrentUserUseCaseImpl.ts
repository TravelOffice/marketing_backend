import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { marketplaceUserRepository, offerRepository } from '../repositories';
import { Offer } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';
import { GetReceivedOffersOfCurrentUserUseCase } from './interfaces/GetReceivedOffersOfCurrentUserUseCase';

export default class GetReceivedOffersOfCurrentUserUseCaseImpl
implements GetReceivedOffersOfCurrentUserUseCase {
  /**
   * Retrieves the received offers of the current user.
   *
   * @param {string} currentUser - Current user
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<Offer | undefined>} - A promise resolving to the retrieved offer
   * or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Extract necessary information from the current user
    const { tenant: organization, username } = currentUser;
    const marketplaceUserId = `${organization}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    return offerRepository.listReceivedOffersOfUser(marketplaceUserId, paginationParams);
  };
}
