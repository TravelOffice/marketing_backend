import DynamoProvider from './DynamoProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
}

const providers : Providers = {
  dynamoProvider: new DynamoProvider(),
};

export const {
  dynamoProvider,
} = providers;
