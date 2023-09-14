import { s3Repository } from '../repositories';
import { CognitoUser, PresignedUrl } from '../models';
import { CreateOrgThumbnailUrlUseCase } from './interfaces/CreateOrgThumbnailUrlUseCase';

export default class CreateOrgThumbnailUrlUseCaseImpl implements CreateOrgThumbnailUrlUseCase {
  invoke = async (
    currentUser: CognitoUser,
    fileName: string,
    fileType: string,
  ): Promise<PresignedUrl> => {
    const { tenant } = currentUser;
    const [, fileExtension] = fileName.split('.');
    const key = `${tenant}/organization/thumbnail.${fileExtension}`;
    return s3Repository.generatePresignedUrl(key, fileType);
  };
}
