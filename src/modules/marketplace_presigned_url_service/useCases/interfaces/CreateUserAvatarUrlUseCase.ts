import { CognitoUser, PresignedUrl } from '../../models';

export interface CreateUserAvatarUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl>,
}
