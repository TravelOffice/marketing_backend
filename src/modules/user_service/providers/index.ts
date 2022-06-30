import DynamoProvider from './DynamoProvider';
import AuthProvider from './AuthProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  authProvider: AuthProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
  authProvider: new AuthProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  dynamoProvider,
  authProvider,
} = providers;
