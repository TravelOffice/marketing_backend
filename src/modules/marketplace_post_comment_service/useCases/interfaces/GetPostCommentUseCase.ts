import { PostComment } from '../../models/PostComment';

export interface GetPostCommentUseCase {
  invoke(tourPostId: string, commentId: string): Promise<PostComment | undefined>,
}
