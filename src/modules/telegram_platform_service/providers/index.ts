import AppSyncProvider from './AppSyncProvider';
import DynamoProvider from './DynamoProvider';
import TelegramPlatformProvider from './TelegramPlatformProvider';
import S3Provider from './S3Provider';

interface Providers {
  dynamoProvider: DynamoProvider,
  telegramProvider: TelegramPlatformProvider,
  appsyncProvider: AppSyncProvider,
  s3Provider: S3Provider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  telegramProvider: new TelegramPlatformProvider(),
  appsyncProvider: new AppSyncProvider(),
  s3Provider: new S3Provider(),
};

export const {
  dynamoProvider,
  telegramProvider,
  appsyncProvider,
  s3Provider,
} = providers;
