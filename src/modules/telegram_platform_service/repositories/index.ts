import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';
import TelegramPlatformRepositoryImpl from './TelegramPlatformRepositoryImpl';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import { MessageRepository } from './interfaces/MessageRepository';
import MessageRepositoryImpl from './MessageRepositoryImpl';

interface Repositories {
  telegramPlatformRepository: TelegramPlatformRepository,
  userRepository: UserRepository,
  messageRepository: MessageRepository,
}

const repositories: Repositories = {
  telegramPlatformRepository: new TelegramPlatformRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  messageRepository: new MessageRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  telegramPlatformRepository,
  userRepository,
  messageRepository,
} = repositories;
