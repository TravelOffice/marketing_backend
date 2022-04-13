import DynamoProvider from './DynamoProvider';
import FacebookApiProvider from './FacebookApiProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  facebookApiProvider: FacebookApiProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  facebookApiProvider: new FacebookApiProvider(),
};

export const {
  dynamoProvider,
  facebookApiProvider,
} = providers;
