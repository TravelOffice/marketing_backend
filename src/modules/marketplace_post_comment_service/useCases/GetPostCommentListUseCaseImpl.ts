import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { GetPostCommentListUseCase } from './interfaces/GetPostCommentListUseCase';
import { PostCommentResponsePayload } from '../models/PostComment';
import { postCommentRepository } from '../repositories';

export default class GetPostCommentListUseCaseImpl implements GetPostCommentListUseCase {
  /**
   * Retrieves the list comment of tour post by the associated tour post ID.
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
