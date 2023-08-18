import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { offerRepository } from '../repositories';
import { Offer, OfferStatus, OfferStatusTypes } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';
import { GetSentOffersOfOrgUseCase } from './interfaces/GetSentOffersOfOrgUseCase';

export default class GetSentOffersOfOrgUseCaseImpl
implements GetSentOffersOfOrgUseCase {
  /**
   * Retrieves a paginated list of sent offers of current user's organization
   * and a specific status.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {OfferStatus} offerStatus - The status of the offer.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of sent offers or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    offerStatus: OfferStatus,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Extract necessary information from the current user
    const { tenant: organizationId } = currentUser;

    // If the offer status is valid, retrieve the list of offers send from organization by status
    if (OfferStatusTypes.includes(offerStatus)) {
      return offerRepository.listSentOffersOfOrganizationByOfferStatus(
        organizationId,
        offerStatus,
        paginationParams,
      );
    }
    // Otherwise, retrieve the list of offers send from organization with all statuses
    return offerRepository.listSentOffersOfOrganization(
      organizationId,
      paginationParams,
    );
  };
}
