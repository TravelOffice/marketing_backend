import { ChatPlatform } from 'common-models';
import { getEnv } from 'get-env';
import { AppSyncEvent } from '../models';

const getSocialPlatformService = (event: AppSyncEvent) => {
  // Event information
  const eventField = event.field;
  const { chatPlatform } = event.arguments;

  // Check whether platform is telegram
  // Force `allTelegramConversations`, `allTelegramMessages` as telegram event
  const isTelegramEvent = eventField.toLowerCase().includes('telegram') || chatPlatform === ChatPlatform.telegram;
  if (isTelegramEvent) {
    // Invoke `telegram_platform_service` service to get the data from Telegram
    return getEnv('TELEGRAM_SERVICE_NAME');
  }

  switch (chatPlatform) {
    case ChatPlatform.facebook:
      return getEnv('FACEBOOK_SERVICE_NAME');

    case ChatPlatform.zalo:
      return getEnv('ZALO_SERVICE_NAME');

    default:
      throw new Error('Social platform is not supported yet.');
  }
};

export default getSocialPlatformService;
