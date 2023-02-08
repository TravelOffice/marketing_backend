import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, meiliSeachProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  MAIL_ACCOUT_INDEX,
  SEARCH_API_KEY_INDEX,
  SEARCH_INDEX,
  TENANT_INDEX,
  USER_INDEX,
} from '../utils/constants';
import { SearchRepository } from './interfaces/SearchRepository';

export default class SearchRepositoryImpl implements SearchRepository {
  /**
   * Generare search token by API key
   * @param apiKey ID the api
   * @returns The search token
   */
  generateSearchToken = async (apiKey: string): Promise<string> => {
    const searchApiKey = await meiliSeachProvider.getApiKey(apiKey);
    // Allow key to exprised after 1 hour
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getTime() + 60 * 60 * 1000);
    const searchRules = {
      '*': {},
    };
    return meiliSeachProvider.generateTenantToken(searchApiKey, searchRules, expiresAt);
  };

  /**
   * Get user search API Key
   * @param tenantId Tenant ID
   * @param page the page information
   * @param customerId the customer ID
   * @returns The API key uid
   */
  private async getApiKey(tenantId: string, userId: string) {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${USER_INDEX}#${userId}`;
    const sk = `${SEARCH_INDEX}#${SEARCH_API_KEY_INDEX}`;
    const item = await dynamoProvider.getItem(table, pk, sk);
    if (!item) return undefined;
    const { apiKey } = item;
    return apiKey;
  }

  /**
   * Update user search API Key
   * @param tenantId Tenant ID
   * @param customerId the customer ID
   * @param apiKey the search api key information
   */
  private async updateApiKey(tenantId: string, userId: string, apiKey: string) {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${USER_INDEX}#${userId}`;
    const sk = `${SEARCH_INDEX}#${SEARCH_API_KEY_INDEX}`;
    await dynamoProvider.putItem(table, pk, sk, { apiKey });
  }

  /**
   * Get user search API Key
   * @param tenantId Tenant ID
   * @param customerId the customer ID
   * @returns The API key uid
   */
  generateApiKeys = async (tenantId: string, userId: string) => {
    // Create api key which allowed only search action
    const actions = ['search'];
    const description = `Allow search for tenant [${tenantId}] user [${userId}]`;

    const apiKey = await this.getApiKey(tenantId, userId);
    // Create search API key if not exist or expired
    if (apiKey) {
      // Check whether key exprised or not
      const searchApiKey = await meiliSeachProvider.getApiKey(apiKey);
      const expiresAt = new Date(searchApiKey.expiresAt).getTime();
      const current = new Date().getTime();
      if (expiresAt <= current) {
        // Delete old Api Key and create new
        meiliSeachProvider.deleteApiKey(apiKey);
      } else {
        return apiKey;
      }
    }
    // Allow key to exprised after 1 day
    const expiresAt = new Date();
    const searchIndex = await this.getAllIndexs(tenantId, userId);
    expiresAt.setDate(expiresAt.getDate() + 1);
    const searchApiKey = await meiliSeachProvider.createApiKey(
      actions,
      description,
      searchIndex,
      expiresAt,
    );

    await this.updateApiKey(tenantId, userId, searchApiKey.key);
    return searchApiKey.key;
  };

  /**
   * Get all search index of the user which avaiable to search
   * @param user the user information
   * @returns The API key uid
   */
  private async getAllIndexs(tenant: string, username: string) {
    // Get the all search index belong to user
    const table = await getAwsSecretValue('DYNAMO_MAIL_TABLE');
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${TENANT_INDEX}#${tenant}#${USER_INDEX}#${username}` },
        ':sk_filter': { S: `${MAIL_ACCOUT_INDEX}#` },
      },
    };

    let searchIndex: string[] = [];
    const { Items: items } = await dynamoProvider.rawQuery(query);
    if (items && items.length > 0) {
      searchIndex = items.map((item) => {
        const account = AWS.DynamoDB.Converter.unmarshall(item);
        if (!account.searchIndex) throw Error(`Missing search index for account ${JSON.stringify(account)}`);
        return account.searchIndex as string;
      });
    }
    return searchIndex;
  }
}
