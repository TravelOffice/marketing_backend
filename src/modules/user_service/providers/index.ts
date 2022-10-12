import DynamoProvider from './DynamoProvider';
import AuthProvider from './AuthProvider';
import TelegramApiProvider from './TelegramApiProvider';
import MeiliSearchProvider from './MeiliSearchProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  authProvider: AuthProvider,
  telegramProvider: TelegramApiProvider,
  meiliSeachProvider: MeiliSearchProvider
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  authProvider: new AuthProvider(),
  telegramProvider: new TelegramApiProvider(),
  meiliSeachProvider: new MeiliSearchProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  dynamoProvider,
  authProvider,
  telegramProvider,
  meiliSeachProvider,
} = providers;
