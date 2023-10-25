import { ChatPlatform } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { TenantTelegramPage } from '../models/TenantTelegramPage';
import { PAGE_INDEX, TENANT_INDEX } from '../utils/constants';
import { PageRepository } from './interfaces/PageRepository';

export default class PageRepositoryImpl implements PageRepository {
  /**
   * Get the page linked with current tenant
   * @param tenantId Tenant ID
   * @param platform chat platform
   * @returns the information of the linked pages
   */
  get = async (tenantId: string, platform: ChatPlatform) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const platformIndex = platform.toUpperCase();
    const input = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': `${TENANT_INDEX}#${tenantId}`,
        ':sk_filter': `${PAGE_INDEX}#${platformIndex}`,
      },
    };
    const pageItems = await dynamoProvider.query(input);
    if (pageItems.length === 0) {
      throw new Error('Page not found!');
    }
    const pageItem = pageItems[0];
    const {
      pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...page
    } = pageItem;
    return { tenantId, ...page } as TenantTelegramPage;
  };
}
