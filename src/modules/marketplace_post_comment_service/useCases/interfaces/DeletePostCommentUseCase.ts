import { CognitoUser } from '../../models/CognitoUser';

export interface DeletePostCommentUseCase {
  invoke(currentUser: CognitoUser, tourPostId: string, postCommentId: string): Promise<void>,
}
