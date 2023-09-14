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
    const key = `${tenant}/users/${username}/avatar/avatar.${fileExtension}`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
