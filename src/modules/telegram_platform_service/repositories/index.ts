import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';
import TelegramPlatformRepositoryImpl from './TelegramPlatformRepositoryImpl';
import { MessageRepository } from './interfaces/MessageRepository';
import MessageRepositoryImpl from './MessageRepositoryImpl';

interface Repositories {
  telegramPlatformRepository: TelegramPlatformRepository,
  messageRepository: MessageRepository,
}

const repositories: Repositories = {
  telegramPlatformRepository: new TelegramPlatformRepositoryImpl(),
  messageRepository: new MessageRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  telegramPlatformRepository,
  messageRepository,
} = repositories;
