// Declare providers which should be used in this service here

import DynamoProvider from './DynamoProvider';
import AppSyncProvider from './AppSyncProvider';
import FbMessagePlatformProvider from './FbMessagePlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  appSyncProvider: AppSyncProvider,
  fbMessagePlatformProvider: FbMessagePlatformProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  appSyncProvider: new AppSyncProvider(),
  fbMessagePlatformProvider: new FbMessagePlatformProvider(),
};

export const {
  dynamoProvider,
  appSyncProvider,
  fbMessagePlatformProvider,
} = providers;
