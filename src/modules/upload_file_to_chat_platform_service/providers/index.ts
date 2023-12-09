// Declare providers which should be used in this service here

import FileProvider from './FileProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  s3Provider: FileProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
}

const providers: Providers = {
  s3Provider: new FileProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
};

export const { s3Provider, zaloMessagePlatformProvider } = providers;
