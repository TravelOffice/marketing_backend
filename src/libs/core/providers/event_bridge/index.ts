import EventBridgeProvider from './EventBridgeProvider';

interface Providers {
  eventBridgeProvider: EventBridgeProvider,
}

const providers: Providers = {
  eventBridgeProvider: new EventBridgeProvider(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  eventBridgeProvider,
} = providers;
