import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { PostRating } from '../../models/PostRating';

export interface GetOrgRatingListUseCase {
  invoke(
    organizationId: string,
    numberStar: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<PostRating> | undefined>,
}
