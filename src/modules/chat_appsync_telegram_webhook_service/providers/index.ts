// Declare providers which should be used in this service here

import DynamoProvider from './DynamoProvider';
import AppSyncProvider from './AppSyncProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  appSyncProvider: AppSyncProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  appSyncProvider: new AppSyncProvider(),
};

export const {
  dynamoProvider,
  appSyncProvider,
} = providers;
