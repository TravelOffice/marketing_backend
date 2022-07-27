// TODO: Declare repository objects which can be used in this service here

import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';
import FbMessagePlatformRepositoryImpl from './FbMessagePlatformRepositoryImpl';
import { ZaloMessagePlatformRepository } from './interfaces/ZaloMessagePlatformRepository';
import ZaloMessagePlatformRepositoryImpl from './ZaloMessagePlatformRepositoryImpl';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  fbMessagePlatformRepository: FbMessagePlatformRepository,
  zaloMessagePlatformRepository: ZaloMessagePlatformRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  fbMessagePlatformRepository: new FbMessagePlatformRepositoryImpl(),
  zaloMessagePlatformRepository: new ZaloMessagePlatformRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  fbMessagePlatformRepository,
  zaloMessagePlatformRepository,
  userRepository,
} = repositories;
