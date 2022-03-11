// TODO: Declare repository objects which can be used in this service here

import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';
import FbMessagePlatformRepositoryImpl from './FbMessagePlatformRepositoryImpl';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';
import ZaloMessagePlatformRepositoryImpl from './ZaloMessagePlatformRepositoryImpl';

interface Repositories {
  fbMessagePlatformRepository: FbMessagePlatformRepository,
  zaloMessagePlatformRepository: ZaloMessagePlatformRepository,
}

const repositories: Repositories = {
  fbMessagePlatformRepository: new FbMessagePlatformRepositoryImpl(),
  zaloMessagePlatformRepository: new ZaloMessagePlatformRepositoryImpl(),
};

export const {
  fbMessagePlatformRepository,
  zaloMessagePlatformRepository,
} = repositories;
