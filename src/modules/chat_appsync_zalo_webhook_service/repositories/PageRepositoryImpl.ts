import AWS from 'aws';
import { ChatPlatform } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { TenantZaloPage } from '../models/TenantZaloPage';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import { PAGE_INDEX, PARTITION_KEY_DELIMITER, TENANT_INDEX } from '../utils/constants';
import { PageRepository } from './interfaces/PageRepository';

export default class PageRepositoryImpl implements PageRepository {
  /**
   * Get the page linked with current tenant
   * @param pageId The platform pageId
   * @returns the information of the linked pages
   */
  get = async (pageId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const chatPlatformIndex = ChatPlatform.zalo.toUpperCase();
    const query: QueryInput = {
      TableName: table,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_page AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':sk_page': { S: `${PAGE_INDEX}#${chatPlatformIndex}#${pageId}` },
        ':pk_filter': { S: `${TENANT_INDEX}#` },
      },
    };
    const { Items: pageItems } = await dynamoProvider.rawQuery(query);
    if (!pageItems || pageItems.length === 0) {
      throw new Error('Page not found!');
    }
    const pageItem = AWS.DynamoDB.Converter.unmarshall(pageItems[0]);
    const {
      pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...page
    } = pageItem;
    const [, tenantId] = pk.split(PARTITION_KEY_DELIMITER);
    return { tenantId, ...page } as TenantZaloPage;
  };
}
