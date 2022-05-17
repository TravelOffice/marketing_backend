// TODO: Declare repository objects which can be used in this service here

import S3RepositoryImpl from './S3RepositoryImpl';
import { S3Repository } from './interfaces/S3Repository';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';
import ZaloMessagePlatformRepositoryImpl from './ZaloMessagePlatformRepositoryImpl';

interface Repositories {
  s3Repository: S3Repository,
  zaloMessagePlatformRepository: ZaloMessagePlatformRepository
}

const repositories: Repositories = {
  s3Repository: new S3RepositoryImpl(),
  zaloMessagePlatformRepository: new ZaloMessagePlatformRepositoryImpl(),
};

export const {
  s3Repository,
  zaloMessagePlatformRepository,
} = repositories;
