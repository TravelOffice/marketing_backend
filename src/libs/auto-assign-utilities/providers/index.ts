import SQSProvider from './SqsProvider';

interface Providers {
  sqsProvider: SQSProvider,
}

const providers: Providers = {
  sqsProvider: new SQSProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const { sqsProvider } = providers;
