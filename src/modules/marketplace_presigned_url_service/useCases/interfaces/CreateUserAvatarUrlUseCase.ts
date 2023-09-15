import { CognitoUser, PresignedUrl } from '../../models';

export interface CreateUserAvatarUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileType: string,
  ): Promise<PresignedUrl>,
}
