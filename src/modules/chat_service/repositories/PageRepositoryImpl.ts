import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, QueryInput } from 'core';
import { PAGE_INDEX, TENANT_INDEX } from '../utils/dynamodbConstants';
import { PageRepository } from './interfaces/PageRepository';

export default class PageRepositoryImpl implements PageRepository {
  /**
   * Get all pages linked with current tenant
   * @param tenantId Tenant ID
   * @returns list of linked pages
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: `${PAGE_INDEX}` },
      },
    };
    const pageItems = await dynamoProvider.query(params);
    if (!pageItems || pageItems.length === 0) {
      return [];
    }
    return pageItems.map((page: any) => ({
      id: page.id,
      name: page.name,
      avatar: page.avatar,
      platform: page.platform,
    }));
  };
}
