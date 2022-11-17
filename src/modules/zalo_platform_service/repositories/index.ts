import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';
import ZaloMessagePlatformRepositoryImpl from './ZaloMessagePlatformRepositoryImpl';

interface Repositories {
  zaloMessagePlatformRepository: ZaloMessagePlatformRepository,
}

const repositories: Repositories = {
  zaloMessagePlatformRepository: new ZaloMessagePlatformRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const { zaloMessagePlatformRepository } = repositories;
