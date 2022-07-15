import DynamoProvider from './DynamoProvider';
import FacebookApiProvider from './FacebookApiProvider';
import TelegramApiProvider from './TelegramApiProvider';
import ZaloApiProvider from './ZaloApiProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  facebookApiProvider: FacebookApiProvider,
  zaloApiProvider: ZaloApiProvider,
  telegramProvider: TelegramApiProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  facebookApiProvider: new FacebookApiProvider(),
  zaloApiProvider: new ZaloApiProvider(),
  telegramProvider: new TelegramApiProvider(),
};

export const {
  dynamoProvider,
  facebookApiProvider,
  zaloApiProvider,
  telegramProvider,
} = providers;
