import AuthProvider from './AuthProvider';
import TelegramApiProvider from './TelegramApiProvider';

interface Providers {
  authProvider: AuthProvider,
  telegramProvider: TelegramApiProvider,
}

const providers: Providers = {
  authProvider: new AuthProvider(),
  telegramProvider: new TelegramApiProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  authProvider,
  telegramProvider,
} = providers;
