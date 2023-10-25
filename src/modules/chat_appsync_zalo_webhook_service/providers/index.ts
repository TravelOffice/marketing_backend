// Declare providers which should be used in this service here

import AppSyncProvider from './AppSyncProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  appSyncProvider: AppSyncProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
}

const providers: Providers = {
  appSyncProvider: new AppSyncProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
};

export const {
  appSyncProvider,
  zaloMessagePlatformProvider,
} = providers;
