import { CognitoUser, PresignedUrl } from '../../models';

export interface CreateOrgThumbnailUrlUseCase {
  invoke(
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl>,
}
