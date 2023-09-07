import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { marketplaceUserRepository, offerRepository } from '../repositories';
import { Offer, OfferStatus } from '../models/Offer';
import { GetSentOffersOfCurrentUserUseCase } from './interfaces/GetSentOffersOfCurrentUserUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class GetSentOffersOfCurrentUserUseCaseImpl
implements GetSentOffersOfCurrentUserUseCase {
  /**
   * Retrieves a specific offer by its ID and the associated tour post ID.
   *
   * @param {string} currentUser - Current user
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @param {OfferStatus} status - The status of the offer.
   * @returns {Promise<Offer | undefined>} - A promise resolving to the retrieved offer
   * or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Extract necessary information from the current user
    const { tenant: organization, username } = currentUser;
    const marketplaceUserId = `${organization}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    return offerRepository.listSentOffersOfUser(marketplaceUserId, paginationParams, status);
  };
}
