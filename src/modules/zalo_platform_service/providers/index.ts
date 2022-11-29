import DynamoProvider from './DynamoProvider';
import S3Provider from './S3Provider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
  s3Provider: S3Provider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
  s3Provider: new S3Provider(),
};

export const {
  dynamoProvider,
  zaloMessagePlatformProvider,
  s3Provider,
} = providers;
