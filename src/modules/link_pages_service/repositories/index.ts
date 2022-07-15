// TODO: Declare repository objects which can be used in this service here

import FacebookPageRepositoryImpl from './FacebookPageRepositoryImpl';
import { FacebookPageRepository } from './interfaces/FacebookPageRepository';
import { PageRepository } from './interfaces/PageRepository';
import { TelegramPageRepository } from './interfaces/TelegramPageRepository';
import { UserRepository } from './interfaces/UserRepository';
import { ZaloPageRepository } from './interfaces/ZaloPageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';
import TelegramPageRepositoryImpl from './TelegramPageRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import ZaloPageRepositoryImpl from './ZaloPageRepositoryImpl';

interface Repositories {
  pageRepository: PageRepository,
  facebookPageRepository: FacebookPageRepository,
  zaloPageRepository: ZaloPageRepository,
  telegramPageRepository: TelegramPageRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  pageRepository: new PageRepositoryImpl(),
  facebookPageRepository: new FacebookPageRepositoryImpl(),
  zaloPageRepository: new ZaloPageRepositoryImpl(),
  telegramPageRepository: new TelegramPageRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  pageRepository,
  facebookPageRepository,
  zaloPageRepository,
  telegramPageRepository,
  userRepository,
} = repositories;
