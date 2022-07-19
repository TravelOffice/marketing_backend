import AppSyncHandlerFactory from './handlers/AppSyncHandlerFactory';
import { AppSyncEvent } from './models';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: AppSyncEvent) => {
  const appSyncHandler = AppSyncHandlerFactory.get(event);
  return appSyncHandler.handle(event);
};
