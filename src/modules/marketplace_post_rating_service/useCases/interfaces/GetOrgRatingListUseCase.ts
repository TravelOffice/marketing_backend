import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { PostRating } from '../../models/PostRating';

export interface GetOrgRatingListUseCase {
  invoke(
    organization: string,
    paginationParams: PaginationParams,
    numberStar?: string,
  ): Promise<PaginationResponsePayload<PostRating> | undefined>,
}
