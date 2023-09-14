import { CognitoUser } from '../../models/CognitoUser';

export interface UpdateThumbnailUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
    cdnUrl: string,
  ): Promise<void>,
}
