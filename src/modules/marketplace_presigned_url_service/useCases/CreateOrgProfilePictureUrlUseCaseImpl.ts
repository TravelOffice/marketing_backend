import crypto from 'crypto';
import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';
import { CreateOrgProfilePictureUrlUseCase } from './interfaces/CreateOrgProfilePictureUrlUseCase';

export default class CreateOrgProfilePictureUrlUseCaseImpl
implements CreateOrgProfilePictureUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant } = currentUser;
    const [, fileExtension] = fileName.split('.');
    const randomByteLength = 16;
    const uid = crypto.randomBytes(randomByteLength).toString('hex');
    const key = `${tenant}/profile-picture/${uid}.${fileExtension}`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
