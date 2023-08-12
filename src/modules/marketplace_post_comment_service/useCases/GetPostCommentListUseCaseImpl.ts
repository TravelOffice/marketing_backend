import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { GetPostCommentListUseCase } from './interfaces/GetPostCommentListUseCase';
import { PostCommentResponsePayload } from '../models/PostComment';
import { postCommentRepository } from '../repositories';

export default class GetPostCommentListUseCaseImpl implements GetPostCommentListUseCase {
  /**
   * Invokes the GetPostCommentListUseCase to delete a comment.
   *
   * @param tourPostId
   * @param paginationParams
   * @returns A Promise that resolves to an array of comments.
   */
  invoke = async (
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PostCommentResponsePayload | undefined> => postCommentRepository.listByPost(
    tourPostId,
    paginationParams,
  );
}
