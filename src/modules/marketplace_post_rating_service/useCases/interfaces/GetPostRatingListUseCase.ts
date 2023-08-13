import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { PostRatingResponsePayload } from '../../models/PostRating';

export interface GetPostRatingListUseCase {
  invoke(
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PostRatingResponsePayload | undefined>,
}
