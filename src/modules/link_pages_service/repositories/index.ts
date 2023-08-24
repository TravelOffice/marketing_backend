// TODO: Declare repository objects which can be used in this service here

import FacebookPageRepositoryImpl from './FacebookPageRepositoryImpl';
import { FacebookPageRepository } from './interfaces/FacebookPageRepository';
import { PageRepository } from './interfaces/PageRepository';
import { TelegramPageRepository } from './interfaces/TelegramPageRepository';
import { ZaloPageRepository } from './interfaces/ZaloPageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';
import TelegramPageRepositoryImpl from './TelegramPageRepositoryImpl';
import ZaloPageRepositoryImpl from './ZaloPageRepositoryImpl';

interface Repositories {
  pageRepository: PageRepository,
  facebookPageRepository: FacebookPageRepository,
  zaloPageRepository: ZaloPageRepository,
  telegramPageRepository: TelegramPageRepository,
}

const repositories: Repositories = {
  pageRepository: new PageRepositoryImpl(),
  facebookPageRepository: new FacebookPageRepositoryImpl(),
  zaloPageRepository: new ZaloPageRepositoryImpl(),
  telegramPageRepository: new TelegramPageRepositoryImpl(),
};

export const {
  pageRepository,
  facebookPageRepository,
  zaloPageRepository,
  telegramPageRepository,
} = repositories;
