import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { postRatingRepository } from '../repositories';
import { GetOrgRatingListUseCase } from './interfaces/GetOrgRatingListUseCase';

export default class GetOrgRatingListUseCaseImpl implements GetOrgRatingListUseCase {
  /**
   * Retrieves a paginated list of post ratings for a specific organization
   * and a specific number of stars.
   *
   * @param {string} organizationId - The ID of the organization for which to retrieve ratings.
   * @param {string} numberStar - The number of stars for which to retrieve ratings.
   * @param {PaginationParams} paginationParams - The parameters for pagination.
   * @returns {Promise<PaginationResponsePayload<PostRating> | undefined>}
   * - A promise resolving to the paginated list of post ratings or undefined if not found.
   */
  invoke = async (
    organizationId: string,
    numberStar: string,
    paginationParams: PaginationParams,
  ) => postRatingRepository.listByOrganization(
    organizationId,
    numberStar,
    paginationParams,
  );
}
