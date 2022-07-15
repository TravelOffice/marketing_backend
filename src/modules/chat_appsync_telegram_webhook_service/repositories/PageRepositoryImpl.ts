import AWS from 'aws';
import { ChatPlatform, TelegramBot } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
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
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: `${PAGE_INDEX}#${platformIndex}` },
      },
    };
    const { Items: pageItems } = await dynamoProvider.rawQuery(query);
    if (!pageItems || pageItems.length === 0) {
      throw new Error('Page not found!');
    }
    const pageItem = AWS.DynamoDB.Converter.unmarshall(pageItems[0]);
    const {
      pk, sk, typeLsi, ...page
    } = pageItem;
    return page as TelegramBot;
  };
}
