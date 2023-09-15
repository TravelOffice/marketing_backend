import crypto from 'crypto';
import { CreateUserAvatarUrlUseCase } from './interfaces/CreateUserAvatarUrlUseCase';
import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';

export default class CreateUserAvatarUrlUseCaseImpl implements CreateUserAvatarUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant, username } = currentUser;
    const [, fileExtension] = fileName.split('.');
    const randomByteLength = 16;
    const uid = crypto.randomBytes(randomByteLength).toString('hex');
    const key = `${tenant}/users/${username}/avatar/${uid}.${fileExtension}`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
