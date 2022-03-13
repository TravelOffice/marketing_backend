// TODO: Declare repository objects which can be used in this service here

import AppSyncRepositoryImpl from './AppSyncRepositoryImpl';
import { AppSyncRepository } from './interfaces/AppSyncRepository';

interface Repositories {
  appSyncRepository: AppSyncRepository,
}

const repositories: Repositories = {
  appSyncRepository: new AppSyncRepositoryImpl(),
};

export const { appSyncRepository } = repositories;
