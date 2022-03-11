import DynamoProvider from './DynamoProvider';
import FbMessagePlatformProvider from './FbMessagePlatformProvider';
import ZaloMessagePlatformProvider from './ZaloMessagePlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  fbMessagePlatformProvider: FbMessagePlatformProvider,
  zaloMessagePlatformProvider: ZaloMessagePlatformProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  fbMessagePlatformProvider: new FbMessagePlatformProvider(),
  zaloMessagePlatformProvider: new ZaloMessagePlatformProvider(),
};

export const { dynamoProvider, fbMessagePlatformProvider, zaloMessagePlatformProvider } = providers;
