import SaleDistributionProvider from './SaleDistributionProvider';
import DynamoProvider from './DynamoProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  saleDistributionProvider: SaleDistributionProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  saleDistributionProvider: new SaleDistributionProvider(),
};

export const {
  dynamoProvider,
  saleDistributionProvider,
} = providers;

export { AttributeValues, QueryInput } from './DynamoProvider';
