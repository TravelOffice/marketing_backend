import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { PostComment } from '../../models/PostComment';

export interface GetPostCommentListUseCase {
  invoke(
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<PostComment> | undefined>,
}
