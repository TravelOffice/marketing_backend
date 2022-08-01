// TODO: Declare repository objects which can be used in this service here

import AppSyncRepositoryImpl from './AppSyncRepositoryImpl';
import { AppSyncRepository } from './interfaces/AppSyncRepository';
import { PageRepository } from './interfaces/PageRepository';
import PageRepositoryImpl from './PageRepositoryImpl';

interface Repositories {
  appSyncRepository: AppSyncRepository,
  pageRepository: PageRepository,
}

const repositories: Repositories = {
  appSyncRepository: new AppSyncRepositoryImpl(),
  pageRepository: new PageRepositoryImpl(),
};

export const { appSyncRepository, pageRepository } = repositories;
