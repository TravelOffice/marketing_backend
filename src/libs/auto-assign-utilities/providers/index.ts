import SQSProvider from './SqsProvider';
import StepFunctionsProvider from './StepFunctionsProvider';

interface Providers {
  sqsProvider: SQSProvider,
  sfnProvider: StepFunctionsProvider,
}

const providers: Providers = {
  sqsProvider: new SQSProvider(),
  sfnProvider: new StepFunctionsProvider(),
};

export const {sqsProvider, sfnProvider} = providers;
