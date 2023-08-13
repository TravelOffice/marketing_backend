import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { PostComment, PostCommentResponsePayload } from '../../models/PostComment';

export interface PostCommentRepository {
  listByPost(
    postId: string,
    paginationParams: PaginationParams,
  ): Promise<PostCommentResponsePayload | undefined>,

  create(comment: PostComment): Promise<PostComment>,

  get(tourPostId: string, id: string): Promise<PostComment | undefined>,

  update(tourPostId: string, id: string, comment: Partial<PostComment>): Promise<PostComment>,

  delete(tourPostId: string, id: string): Promise<void>,

  generateCode(): Promise<string>,
}
