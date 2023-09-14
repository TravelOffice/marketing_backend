import * as crypto from 'crypto';
import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';
import { CreatePostThumbnailUrlUseCase } from './interfaces/CreatePostThumbnaillUrlUseCase';

export default class CreatePostThumbnailUrlUseCaseImpl implements CreatePostThumbnailUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant } = currentUser;
    const [, fileExtension] = fileName.split('.');
    const randomByteLength = 16;
    const uid = crypto.randomBytes(randomByteLength).toString('hex');
    const key = `${tenant}/posts/${uid}.${fileExtension}`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
