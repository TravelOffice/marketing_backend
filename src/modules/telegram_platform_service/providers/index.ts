import DynamoProvider from './DynamoProvider';
import TelegramPlatformProvider from './TelegramPlatformProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  telegramProvider: TelegramPlatformProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  telegramProvider: new TelegramPlatformProvider(),
};

export const {
  dynamoProvider,
  telegramProvider,
} = providers;
