import { AppSyncEvent } from '../models';
import { AppSyncNotificationResponse } from '../models/AppSyncNotificationResponse';
import logger from '../utils/logger';
import { AppSyncHandler } from './AppSyncHandler';

export default class SendNotificationHandler implements AppSyncHandler {
  // Handler for sending notification to client
  handle = async (event: AppSyncEvent): Promise<AppSyncNotificationResponse> => {
    logger.log(`Received notification message ${JSON.stringify(event.arguments, null, 2)}`);
    return event.arguments;
  };
}
