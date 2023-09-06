import DynamoProvider from './DynamoProvider';
import AuthProvider from './AuthProvider';
import TelegramApiProvider from './TelegramApiProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  authProvider: AuthProvider,
  telegramProvider: TelegramApiProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  authProvider: new AuthProvider(),
  telegramProvider: new TelegramApiProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  dynamoProvider,
  authProvider,
  telegramProvider,
} = providers;
