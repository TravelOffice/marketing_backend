// Declare providers which should be used in this service here

import DynamoProvider from './DynamoProvider';
import AppSyncProvider from './AppSyncProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  appSyncProvider: AppSyncProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  appSyncProvider: new AppSyncProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
};

export const {
  dynamoProvider,
  appSyncProvider,
  zaloMessagePlatformProvider,
} = providers;
