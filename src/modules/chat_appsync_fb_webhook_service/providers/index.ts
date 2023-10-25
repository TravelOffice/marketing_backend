// Declare providers which should be used in this service here

import AppSyncProvider from './AppSyncProvider';
import FbMessagePlatformProvider from './FbMessagePlatformProvider';

interface Providers {
  appSyncProvider: AppSyncProvider,
  fbMessagePlatformProvider: FbMessagePlatformProvider,
}

const providers: Providers = {
  appSyncProvider: new AppSyncProvider(),
  fbMessagePlatformProvider: new FbMessagePlatformProvider(),
};

export const {
  appSyncProvider,
  fbMessagePlatformProvider,
} = providers;
