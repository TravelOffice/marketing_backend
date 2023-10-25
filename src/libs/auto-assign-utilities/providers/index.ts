import SQSProvider from './SqsProvider';
import StepFunctionsProvider from './StepFunctionsProvider';
import DynamoProvider from './DynamoProvider';

interface Providers {
  dynamoProvider: DynamoProvider,
  sqsProvider: SQSProvider,
  sfnProvider: StepFunctionsProvider,
}

const providers: Providers = {
  dynamoProvider: new DynamoProvider(),
  sqsProvider: new SQSProvider(),
  sfnProvider: new StepFunctionsProvider(),
};

export const { sqsProvider, sfnProvider, dynamoProvider } = providers;
