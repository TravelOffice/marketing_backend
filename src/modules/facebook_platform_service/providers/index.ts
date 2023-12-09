import FbMessagePlatformProvider from './FbMessagePlatformProvider';

interface Providers {
  fbMessagePlatformProvider: FbMessagePlatformProvider,
}

const providers: Providers = {
  fbMessagePlatformProvider: new FbMessagePlatformProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  fbMessagePlatformProvider,
} = providers;
