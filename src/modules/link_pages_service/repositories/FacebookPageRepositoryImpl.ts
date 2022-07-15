import AWS from 'aws';
import { ChatPlatform, FacebookPage } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, facebookApiProvider } from '../providers';
import { PAGE_INDEX, TENANT_INDEX } from '../utils/constants';
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
      platform: ChatPlatform.facebook,
    };
  };

  saveToDynamo = async (tenantId: string, page: FacebookPage) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const facebookIndex = `${PAGE_INDEX}#${ChatPlatform.facebook.toUpperCase()}`;
    const linkedPages = await dynamoProvider.query({
      TableName: travelTable,
      KeyConditionExpression: 'pk = :pk_tenant AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: facebookIndex },
      },
    });
    if (linkedPages.Items && linkedPages.Items.length > 0) {
      // Remove previous item before insert new one
      const { sk, pk, ...rest } = AWS.DynamoDB.Converter.unmarshall(linkedPages.Items[0]);
      const linkedPage = rest as FacebookPage;
      await dynamoProvider.deleteItem(travelTable, `${TENANT_INDEX}#${tenantId}`, `${facebookIndex}#${linkedPage.id}`);
    }
    await dynamoProvider.putItem(travelTable, `${TENANT_INDEX}#${tenantId}`, `${facebookIndex}#${page.id}`, page);
  };
}
