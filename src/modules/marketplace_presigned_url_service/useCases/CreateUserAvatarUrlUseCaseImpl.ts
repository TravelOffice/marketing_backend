import { CreateUserAvatarUrlUseCase } from './interfaces/CreateUserAvatarUrlUseCase';
import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';

export default class CreateUserAvatarUrlUseCaseImpl implements CreateUserAvatarUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant, username } = currentUser;
    const key = `${tenant}/users/${username}/avatar/avatar.png`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
