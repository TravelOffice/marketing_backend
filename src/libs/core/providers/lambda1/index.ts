import LambdaProvider from './LambdaProvider';

interface Providers {
  lambdaProvider: LambdaProvider,
}

const providers: Providers = {
  lambdaProvider: new LambdaProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  lambdaProvider,
} = providers;

export {
  InvocationType, LogType,
} from './LambdaProvider';
