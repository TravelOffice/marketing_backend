// Declare providers which should be used in this service here

import AppSyncProvider from './AppSyncProvider';

interface Providers {
  appSyncProvider: AppSyncProvider,
}

const providers: Providers = {
  appSyncProvider: new AppSyncProvider(),
};

export const {
  appSyncProvider,
} = providers;
