import { AppSyncEvent } from '../models';
import { AppSyncReponse } from '../models/AppSyncResponse';
import { AppSyncHandler } from './AppSyncHandler';

export default class ReceiveMessageHandler implements AppSyncHandler {
  // Customer send message from social platform
  // or Sales user send message to customer from Sales web / message platform.
  // Then, webhook api received new message and call AppSync `receivedMessage` directly.
  handle = async (event: AppSyncEvent) : Promise<AppSyncReponse> => ({
    message: `One message is received by Sales Webhook and passthrough to AppSync: ${JSON.stringify(event.arguments, null, 2)}`,
    data: event.arguments,
  });
}
