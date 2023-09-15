import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';
import { CreateOrgProfilePictureUrlUseCase } from './interfaces/CreateOrgProfilePictureUrlUseCase';

export default class CreateOrgProfilePictureUrlUseCaseImpl
implements CreateOrgProfilePictureUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant } = currentUser;
    const key = `${tenant}/organization/profilePicture.png`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
