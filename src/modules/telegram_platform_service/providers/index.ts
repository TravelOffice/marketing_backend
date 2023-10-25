import AppSyncProvider from './AppSyncProvider';
import TelegramPlatformProvider from './TelegramPlatformProvider';
import FileProvider from './FileProvider';

interface Providers {
  telegramProvider: TelegramPlatformProvider,
  appsyncProvider: AppSyncProvider,
  fileProvider: FileProvider,
}

const providers: Providers = {
  telegramProvider: new TelegramPlatformProvider(),
  appsyncProvider: new AppSyncProvider(),
  fileProvider: new FileProvider(),
};

export const {
  telegramProvider,
  appsyncProvider,
  fileProvider,
} = providers;
