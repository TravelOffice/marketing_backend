import DynamoProvider from './DynamoProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
};

export const {
  dynamoProvider,
  zaloMessagePlatformProvider,
} = providers;
