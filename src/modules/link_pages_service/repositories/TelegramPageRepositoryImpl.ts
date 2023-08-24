import { ChatPlatform, TelegramBot } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { telegramProvider } from '../providers';
import {
  PAGE_INDEX,
  TELEGRAM_WEBHOOK_ALLOWED_UPDATES,
  TELEGRAM_WEBHOOK_DROP_PENDING_UPDATES,
  TELEGRAM_WEBHOOK_MAX_CONNECTION,
  TENANT_INDEX,
} from '../utils/constants';
import { TelegramPageRepository } from './interfaces/TelegramPageRepository';

export default class TelegramPageRepositoryImpl implements TelegramPageRepository {
  /**
   * Request HTTP request to get Telegram bot info
   * @param accessToken Token api of Telegram bot
   * @returns Telegram bot object
   */
  getBotInfo = async (accessToken: string): Promise<TelegramBot> => {
    const res = await telegramProvider.get(`bot${accessToken}/getMe`);
    return { ...res, accessToken, platform: ChatPlatform.telegram };
  };

  /**
   * Save telegram bot information to dynamodb
   * @param tenantId The Tenant id
   * @param page Telegram bot information
   */
  saveToDynamo = async (tenantId: string, page: TelegramBot) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.putItem(
      travelTable,
      `${TENANT_INDEX}#${tenantId}`,
      `${PAGE_INDEX}#${ChatPlatform.telegram.toUpperCase()}#${page.id}`,
      {
        ...page,
        id: page.id.toString(),
      },
    );
  };

  /**
   * Send HTTP request to register webhook
   * @param accessToken The telegram bot token api
   * @param webhookUrl The url of webhook
   * @param tenantId The Tenant id
   * @param secretToken The key to ensure that the request comes from a webhook set by you
   * @returns True on success
   */
  registerWebhook = async (accessToken: string, webhookUrl: string, tenantId: string, secretToken: string) => telegramProvider.get(`bot${accessToken}/setWebhook`, {
    url: `${webhookUrl}/${tenantId}`,
    max_connections: TELEGRAM_WEBHOOK_MAX_CONNECTION,
    allowed_updates: TELEGRAM_WEBHOOK_ALLOWED_UPDATES,
    drop_pending_updates: TELEGRAM_WEBHOOK_DROP_PENDING_UPDATES,
    secret_token: secretToken,
  });
}
