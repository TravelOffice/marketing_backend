import { ChatPlatform } from 'common-models';
import { AppSyncEvent } from '../models/AppSyncEvent';
import FacebookZaloAppSyncHandler from './FacebookZaloAppSyncHandler';
import ReceiveMessageHandler from './ReceiveMessageHandler';
import SendNotificationHandler from './SendNotificationHandler';
import TelegramHandler from './TelegramHandler';

export default class AppSyncHandlerFactory {
  static get = (event: AppSyncEvent) => {
    const eventField = event.field;
    const { chatPlatform } = event.arguments;

    // Handle receive message event
    if (eventField === 'receivedMessage') {
      return new ReceiveMessageHandler();
    }

    // Handle send notification event
    if (eventField === 'sendNotification') {
      return new SendNotificationHandler();
    }

    // Check whether platform is telegram
    // Force `allTelegramConversations`, `allTelegramMessages` as telegram event
    const isTelegramEvent = eventField.toLowerCase().includes('telegram') || chatPlatform === ChatPlatform.telegram;
    if (isTelegramEvent) {
      // Invoke `telegram_platform_service` service to get the data from Telegram
      return new TelegramHandler();
    }
    return new FacebookZaloAppSyncHandler();
  };
}
