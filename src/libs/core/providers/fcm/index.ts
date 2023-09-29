import FcmProvider from './FcmProvider';

interface Providers {
  fcmProvider: FcmProvider,
}

const providers: Providers = {
  fcmProvider: new FcmProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  fcmProvider,
} = providers;
