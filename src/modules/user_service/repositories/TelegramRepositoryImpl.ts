import { ChatPlatform } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { telegramProvider } from '../providers';
import { PAGE_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { TelegramRepository } from './interfaces/TelegramRepository';

export default class TelegramRepositoryImpl implements TelegramRepository {
  /**
   * Delete the registered webhook
   * @param accessToken Telegam bot token API
   * @returns Void
   */
  deleteWebhook = async (accessToken: string) => {
    const result = await telegramProvider.get(`bot${accessToken}/deleteWebhook`);
    logger.log(`[TelegramRepository.deleteWebhook] Result: ${result}`);
  };

  /**
   * Get the linked page in dynamo DB
   * @param tenantId ID of the tenant
   * @param pageId Id of page
   * @returns The linked page
   */
  get = async (tenantId: string, pageId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${PAGE_INDEX}#${ChatPlatform.telegram.toUpperCase()}#${pageId}`;
    return dynamoProvider.getItem(table, pk, sk);
  };
}
