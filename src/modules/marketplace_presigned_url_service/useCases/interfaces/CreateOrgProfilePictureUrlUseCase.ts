import { CognitoUser, PresignedUrl } from '../../models';

export interface CreateOrgProfilePictureUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl>,
}
