// Declare providers which should be used in this service here

import S3Provider from './S3Provider';
import DynamoProvider from './DynamoProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  s3Provider: S3Provider,
  dynamoProvider: DynamoProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
}

const providers: Providers = {
  s3Provider: new S3Provider(),
  dynamoProvider: new DynamoProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
};

export const { s3Provider, dynamoProvider, zaloMessagePlatformProvider } = providers;
