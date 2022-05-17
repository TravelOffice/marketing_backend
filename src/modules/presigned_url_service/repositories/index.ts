// TODO: Declare repository objects which can be used in this service here

import S3RepositoryImpl from './S3RepositoryImpl';
import { S3Repository } from './interfaces/S3Repository';

interface Repositories {
  s3Repository: S3Repository,
}

const repositories : Repositories = {
  s3Repository: new S3RepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  s3Repository,
} = repositories;
