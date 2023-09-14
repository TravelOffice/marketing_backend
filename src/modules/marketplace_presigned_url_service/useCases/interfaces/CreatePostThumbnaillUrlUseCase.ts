import { CognitoUser, PresignedUrl } from '../../models';

export interface CreatePostThumbnailUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl>,
}
