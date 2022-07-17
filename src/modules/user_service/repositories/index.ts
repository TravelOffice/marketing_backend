import { UserRepository } from './interfaces/UserRepository';
import { PageRepository } from './interfaces/PageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import { TelegramRepository } from './interfaces/TelegramRepository';
import TelegramRepositoryImpl from './TelegramRepositoryImpl';

interface Repositories {
  userRepository: UserRepository,
  pageRepository: PageRepository,
  telegramRepository: TelegramRepository,
}

const repositories : Repositories = {
  userRepository: new UserRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
  telegramRepository: new TelegramRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  userRepository,
  pageRepository,
  telegramRepository,
} = repositories;
