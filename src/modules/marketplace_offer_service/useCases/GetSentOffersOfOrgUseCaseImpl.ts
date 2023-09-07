import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { offerRepository } from '../repositories';
import { Offer, OfferStatus } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';
import { GetSentOffersOfOrgUseCase } from './interfaces/GetSentOffersOfOrgUseCase';

export default class GetSentOffersOfOrgUseCaseImpl
implements GetSentOffersOfOrgUseCase {
  /**
   * Retrieves a paginated list of sent offers of current user's organization
   * and a specific status.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {OfferStatus} status - The status of the offer.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of sent offers or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
    status?: OfferStatus,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Extract necessary information from the current user
    const { tenant: organization } = currentUser;

    // Otherwise, retrieve the list of offers send from organization
    return offerRepository.listSentOffersOfOrganization(
      organization,
      paginationParams,
      status,
    );
  };
}
