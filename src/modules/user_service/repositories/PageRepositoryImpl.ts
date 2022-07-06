import AWS from 'aws';
import { ChatPlatform } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import { PAGE_INDEX, TENANT_INDEX } from '../utils/constants';
import { PageRepository } from './interfaces/PageRepository';

export default class PageRepositoryImpl implements PageRepository {
  /**
   * Get all pages linked with current tenant
   * @param tenantId Tenant ID
   * @returns list of linked pages
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: `${PAGE_INDEX}` },
      },
    };
    const { Items: pageItems } = await dynamoProvider.rawQuery(query);
    if (!pageItems || pageItems.length === 0) {
      return [];
    }
    const linkedPages = pageItems.map((item: any) => {
      const page = AWS.DynamoDB.Converter.unmarshall(item);
      return {
        id: page.id,
        name: page.name,
        avatar: page.avatar,
        platform: page.platform,
      };
    });
    return linkedPages;
  };

  /**
   * Delete the linked page in dynamo db
   * @param tenantId ID of tenant
   * @param platform Platform of page
   * @param pageId ID of page
   * @returns void
   */
  delete = async (tenantId: string, platform: ChatPlatform, pageId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${PAGE_INDEX}#${platform.toUpperCase()}#${pageId}`;
    return dynamoProvider.deleteItem(table, pk, sk);
  };
}
