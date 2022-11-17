import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';
import FbMessagePlatformRepositoryImpl from './FbMessagePlatformRepositoryImpl';

interface Repositories {
  fbMessagePlatformRepository: FbMessagePlatformRepository,
}

const repositories: Repositories = {
  fbMessagePlatformRepository: new FbMessagePlatformRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const { fbMessagePlatformRepository } = repositories;
