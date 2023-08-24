import FacebookApiProvider from './FacebookApiProvider';
import TelegramApiProvider from './TelegramApiProvider';
import ZaloApiProvider from './ZaloApiProvider';

interface Providers {
  facebookApiProvider: FacebookApiProvider,
  zaloApiProvider: ZaloApiProvider,
  telegramProvider: TelegramApiProvider,
}

const providers: Providers = {
  facebookApiProvider: new FacebookApiProvider(),
  zaloApiProvider: new ZaloApiProvider(),
  telegramProvider: new TelegramApiProvider(),
};

export const {
  facebookApiProvider,
  zaloApiProvider,
  telegramProvider,
} = providers;
