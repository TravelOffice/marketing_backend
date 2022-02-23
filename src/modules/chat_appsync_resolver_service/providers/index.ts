import DynamoProvider from './DynamoProvider';
import FbMessagePlatformProvider from './FbMessagePlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  fbMessagePlatformProvider: FbMessagePlatformProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  fbMessagePlatformProvider: new FbMessagePlatformProvider()
};

export const { dynamoProvider, fbMessagePlatformProvider } = providers;
