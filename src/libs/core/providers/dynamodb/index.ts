import DynamoProvider from './DynamoProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  dynamoProvider,
} = providers;

export {
  QueryInput,
  PutItemInput,
  GetItemInput,
  UpdateItemInput,
  DeleteItemInput,
  BatchGetItemInput,
  KeyList,
  AttributeValues,
  PaginationResponsePayload,
  PaginationParams,
  ReturnValue,
} from './DynamoProvider';
