import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { FacebookPage } from '../models/FacebookPage';
import { dynamoProvider, facebookApiProvider } from '../providers';
import { FACEBOOK_PAGE_INDEX, TENANT_INDEX } from '../utils/constants';
import { FacebookPageRepository } from './interfaces/FacebookPageRepository';

export default class FacebookPageRepositoryImpl implements FacebookPageRepository {
  exchangeUserAccessToken = async (token: string) => {
    const params = {
      grant_type: 'fb_exchange_token',
      client_id: await getAwsSecretValue('FACEBOOK_CLIENT_ID'),
      client_secret: await getAwsSecretValue('FACEBOOK_CLIENT_SECRET'),
      fb_exchange_token: token,
    };
    const res = await facebookApiProvider.get('oauth/access_token', undefined, params);
    return res.access_token;
  };

  getPageAccessToken = async (pageId: string, userAccessToken: string) : Promise<FacebookPage> => {
    const params = {
      fields: 'access_token,name',
    };
    const res = await facebookApiProvider.get(pageId, userAccessToken, params);
    return {
      id: res.id,
      name: res.name,
      accessToken: res.access_token,
    };
  };

  saveToDynamo = async (tenantId: string, page: FacebookPage) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const linkedPages = await dynamoProvider.query({
      TableName: saleChatTable,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: FACEBOOK_PAGE_INDEX },
      },
    });
    if (linkedPages.Items && linkedPages.Items.length > 0) {
      // Remove previous item before insert new one
      const { sk, pk, ...rest } = AWS.DynamoDB.Converter.unmarshall(linkedPages.Items[0]);
      const linkedPage = rest as FacebookPage;
      await dynamoProvider.deleteItem(saleChatTable, `${TENANT_INDEX}#${tenantId}`, `${FACEBOOK_PAGE_INDEX}${linkedPage.id}`);
    }
    await dynamoProvider.putItem(saleChatTable, `${TENANT_INDEX}#${tenantId}`, `${FACEBOOK_PAGE_INDEX}${page.id}`, page);
  };

  /**
   * Check whether the page is linked to another tenant or not
   * @param pageId ID of Facebook page
   * @param tenantId ID of the tenant
   * @returns true if the page is linked to another tenant otherwise false
   */
  checkPageLinkedToAnotherTenant = async (pageId: string, tenantId: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const linkedPages = await dynamoProvider.query({
      TableName: saleChatTable,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_pageId AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':sk_pageId': { S: `${FACEBOOK_PAGE_INDEX}${pageId}` },
        ':pk_filter': { S: `${TENANT_INDEX}#` },
      },
    });
    if (linkedPages.Items) {
      return linkedPages.Items.length > 1
      || linkedPages.Items.some((page) => page.tenantId !== tenantId);
    }
    return false;
  };
}
