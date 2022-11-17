import { AppSyncEvent } from '../models/AppSyncEvent';
import ReceiveMessageHandler from './ReceiveMessageHandler';
import SendNotificationHandler from './SendNotificationHandler';
import SocialPlatformHandler from './SocialPlatformHandler';

export default class AppSyncHandlerFactory {
  static get = (event: AppSyncEvent) => {
    const eventField = event.field;

    // Handle receive message event
    if (eventField === 'receivedMessage') {
      return new ReceiveMessageHandler();
    }

    // Handle send notification event
    if (eventField === 'sendNotification') {
      return new SendNotificationHandler();
    }

    // Otherwise, handle event for specific platform
    return new SocialPlatformHandler();
  };
}
