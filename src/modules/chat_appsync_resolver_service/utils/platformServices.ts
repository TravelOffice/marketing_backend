import { ChatPlatform } from 'common-models';
import { getEnv } from 'get-env';
import { AppSyncEvent } from '../models';

const getSocialPlatformService = (event: AppSyncEvent) => {
  // Event information
  const eventField = event.field.toLowerCase();
  const { chatPlatform } = event.arguments;

  if (eventField.includes('fb') || chatPlatform === ChatPlatform.facebook) {
    return getEnv('FACEBOOK_SERVICE_NAME');
  }

  if (eventField.includes('zalo') || chatPlatform === ChatPlatform.zalo) {
    return getEnv('ZALO_SERVICE_NAME');
  }

  if (eventField.includes('telegram') || chatPlatform === ChatPlatform.telegram) {
    return getEnv('TELEGRAM_SERVICE_NAME');
  }

  throw new Error('Social platform is not supported yet.');
};

export default getSocialPlatformService;
