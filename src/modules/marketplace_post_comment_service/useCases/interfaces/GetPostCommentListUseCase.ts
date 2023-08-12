import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { PostCommentResponsePayload } from '../../models/PostComment';

export interface GetPostCommentListUseCase {
  invoke(
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PostCommentResponsePayload | undefined>,
}
