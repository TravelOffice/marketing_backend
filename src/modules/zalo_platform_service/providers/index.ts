import FileProvider from './FileProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
  fileProvider: FileProvider,
}

const providers: Providers = {
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
  fileProvider: new FileProvider(),
};

export const {
  zaloMessagePlatformProvider,
  fileProvider,
} = providers;
