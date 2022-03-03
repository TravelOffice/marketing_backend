// TODO: Declare repository objects which can be used in this service here

import { FbMessagePlatformRepository } from './interfaces/FbMessagePlatformRepository';
import FbMessagePlatformRepositoryImpl from './FbMessagePlatformRepositoryImpl';

interface Repositories {
  fbMessagePlatformRepository: FbMessagePlatformRepository,
}

const repositories: Repositories = {
  fbMessagePlatformRepository: new FbMessagePlatformRepositoryImpl(),
};

export const {
  fbMessagePlatformRepository,
} = repositories;
