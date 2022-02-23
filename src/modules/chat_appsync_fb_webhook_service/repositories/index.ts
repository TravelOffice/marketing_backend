// TODO: Declare repository objects which can be used in this service here

import { AppSyncRepository } from './interfaces/AppSyncRepository';
import AppSyncRepositoryImpl from './AppSyncRepositoryImpl';

interface Repositories {
  appSyncRepository: AppSyncRepository,
}

const repositories: Repositories = {
  appSyncRepository: new AppSyncRepositoryImpl(),
};

export const { appSyncRepository } = repositories;
