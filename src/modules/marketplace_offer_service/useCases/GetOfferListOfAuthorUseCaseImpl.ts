import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { marketplaceUserRepository, offerRepository } from '../repositories';
import { Offer } from '../models/Offer';
import { GetOfferListOfAuthorUseCase } from './interfaces/GetOfferListOfAuthorUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class GetOfferListOfAuthorUseCaseImpl implements GetOfferListOfAuthorUseCase {
  /**
   * Retrieves a specific offer by its ID and the associated tour post ID.
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
    const { tenant: organizationId, username } = currentUser;
    const marketplaceUserId = `${organizationId}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    return offerRepository.listByAuthor(marketplaceUserId, paginationParams);
  };
}
