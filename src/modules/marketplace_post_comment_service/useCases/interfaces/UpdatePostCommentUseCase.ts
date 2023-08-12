import { PostComment } from '../../models/PostComment';
import { UpdatePostCommentDto } from '../../dto/UpdatePostCommentDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdatePostCommentUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    postCommentId: string,
    updateCommentDto: UpdatePostCommentDto,
  ): Promise<PostComment>,
}
