import DynamoProvider from './DynamoProvider';
import ZaloApiProvider from './ZaloApiProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  zaloApiProvider: ZaloApiProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  zaloApiProvider: new ZaloApiProvider(),
};

export const {
  dynamoProvider,
  zaloApiProvider,
} = providers;
