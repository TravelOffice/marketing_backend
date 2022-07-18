import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';
import TelegramPlatformRepositoryImpl from './TelegramPlatformRepositoryImpl';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  telegramPlatformRepository: TelegramPlatformRepository,
  userRepository: UserRepository,
}

const repositories: Repositories = {
  telegramPlatformRepository: new TelegramPlatformRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  telegramPlatformRepository,
  userRepository,
} = repositories;
