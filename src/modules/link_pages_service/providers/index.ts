import DynamoProvider from './DynamoProvider';
import FacebookApiProvider from './FacebookApiProvider';
import ZaloApiProvider from './ZaloApiProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  facebookApiProvider: FacebookApiProvider,
  zaloApiProvider: ZaloApiProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  facebookApiProvider: new FacebookApiProvider(),
  zaloApiProvider: new ZaloApiProvider(),
};

export const {
  dynamoProvider,
  facebookApiProvider,
  zaloApiProvider,
} = providers;
