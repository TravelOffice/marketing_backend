import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { userRepository } from '.';
import { User } from '../models';
import { dynamoProvider, meiliSeachProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import { MAIL_ACCOUT_INDEX, TENANT_INDEX, USER_INDEX } from '../utils/constants';
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
   * @param user the user information
   * @returns The API key uid
   */
  getApiKeys = async (user: User) => {
    // Create api key which allowed only search action
    const actions = ['search'];
    const description = `Allow search for tenant [${user.tenant}] user [${user.username}]`;

    // Create search API key if not exist or expired
    if (user.searchApiKey) {
      // Check whether key exprised or not
      const searchApiKey = await meiliSeachProvider.getApiKey(user.searchApiKey);
      const expiresAt = new Date(searchApiKey.expiresAt).getTime;
      const current = new Date().getTime;
      if (expiresAt <= current) {
        // Delete old Api Key and create new
        meiliSeachProvider.deleteApiKey(user.searchApiKey);
      } else {
        return user.searchApiKey;
      }
    }
    // Allow key to exprised after 1 day
    const expiresAt = new Date();
    const searchIndex = await this.getAllIndexs(user.tenant, user.username);
    expiresAt.setDate(expiresAt.getDate() + 1);
    const searchApiKey = await meiliSeachProvider.createApiKey(
      actions,
      description,
      searchIndex,
      expiresAt,
    );
    // Update the api key to user record
    const newUser = { ...user };
    newUser.searchApiKey = searchApiKey.key;
    userRepository.update(user.tenant, newUser);
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
