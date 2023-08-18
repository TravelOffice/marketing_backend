import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { offerRepository } from '../repositories';
import { Offer } from '../models/Offer';
import { CognitoUser } from '../models/CognitoUser';
import { GetReceivedOffersOfOrgUseCase } from './interfaces/GetReceivedOffersOfOrgUseCase';

export default class GetReceivedOffersOrgUseCaseImpl
implements GetReceivedOffersOfOrgUseCase {
  /**
   * Retrieves a paginated list of received offers of current user's organization
   * and a specific status.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<Offer> | undefined>}
   * - A promise resolving to the paginated list of received offers or undefined if not found.
   */
  invoke = async (
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<Offer> | undefined> => {
    // Extract necessary information from the current user
    const { tenant: organizationId } = currentUser;

    return offerRepository.listReceivedOffersOfOrganization(
      organizationId,
      paginationParams,
    );
  };
}
