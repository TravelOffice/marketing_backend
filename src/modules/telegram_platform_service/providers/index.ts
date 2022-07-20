import AppSyncProvider from './AppSyncProvider';
import DynamoProvider from './DynamoProvider';
import TelegramPlatformProvider from './TelegramPlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  telegramProvider: TelegramPlatformProvider,
  appsyncProvider: AppSyncProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  telegramProvider: new TelegramPlatformProvider(),
  appsyncProvider: new AppSyncProvider(),
};

export const {
  dynamoProvider,
  telegramProvider,
  appsyncProvider,
} = providers;
