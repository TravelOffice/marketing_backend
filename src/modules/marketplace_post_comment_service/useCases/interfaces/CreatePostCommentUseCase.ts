import { PostComment } from '../../models/PostComment';
import { CreatePostCommentDto } from '../../dto/CreatePostCommentDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreatePostCommentUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    createCommentDto: CreatePostCommentDto,
  ): Promise<PostComment>,
}
