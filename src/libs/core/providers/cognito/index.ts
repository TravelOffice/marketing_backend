import CognitoProvider from './CognitoProvider';

interface Providers {
  cognitoProvider: CognitoProvider,
}

const providers: Providers = {
  cognitoProvider: new CognitoProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  cognitoProvider,
} = providers;

export {
  DeliveryMediumType,
} from './CognitoProvider';
