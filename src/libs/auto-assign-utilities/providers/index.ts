import DynamoProvider from './DynamoProvider';
import SQSProvider from './SqsProvider';
import StepFunctionsProvider from './StepFunctionsProvider';

interface Providers {
  sqsProvider: SQSProvider,
  sfnProvider: StepFunctionsProvider,
  dynamoProvider: DynamoProvider,
}

const providers: Providers = {
  sqsProvider: new SQSProvider(),
  sfnProvider: new StepFunctionsProvider(),
  dynamoProvider: new DynamoProvider(),
};

export const { sqsProvider, sfnProvider, dynamoProvider } = providers;
