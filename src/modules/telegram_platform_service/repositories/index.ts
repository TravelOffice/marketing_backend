import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';
import TelegramPlatformRepositoryImpl from './TelegramPlatformRepositoryImpl';

interface Repositories {
  telegramPlatformRepository: TelegramPlatformRepository,
}

const repositories: Repositories = {
  telegramPlatformRepository: new TelegramPlatformRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  telegramPlatformRepository,
} = repositories;
