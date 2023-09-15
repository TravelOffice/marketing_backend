import { CognitoUser, PresignedUrl } from '../../models';

export interface CreateOrgProfilePictureUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileType: string,
  ): Promise<PresignedUrl>,
}
