import { getAwsSecretValue } from 'get-env';
import MeiliSearch, { Key } from 'meilisearch';
import logger from '../utils/logger';

export default class MeiliSearchProvider {
  private meiliSearchClient?: MeiliSearch;

  private readonly getClient = async () => {
    if (!this.meiliSearchClient) {
      const searchEndpoint = await getAwsSecretValue('SEARCH_ENGINE_ENDPOINT');
      const searchMasterKey = await getAwsSecretValue('SEARCH_ENGINE_MASTER_KEY');
      this.meiliSearchClient = new MeiliSearch(
        { host: searchEndpoint, apiKey: searchMasterKey },
      );
    }
    return this.meiliSearchClient;
  };

  getApiKey = async (
    uid: string,
  ): Promise<Key> => {
    try {
      const client = await this.getClient();
      return client.getKey(uid);
    } catch (e: any) {
      logger.log(`Get key error ${uid}`);
      throw e;
    }
  };

  createApiKey = async (
    actions: string[],
    description: string,
    indexes: string[],
    expiresAt: Date,
  ): Promise<Key> => {
    try {
      const client = await this.getClient();
      return client.createKey({
        description,
        actions,
        indexes,
        expiresAt: expiresAt.toISOString(),
      });
    } catch (e: any) {
      logger.log('Create key error');
      throw e;
    }
  };

  deleteApiKey = async (
    uid: string,
  ) => {
    try {
      const client = await this.getClient();
      return client.deleteKey(uid);
    } catch (e: any) {
      logger.log(`Delete key error ${uid}`);
      throw e;
    }
  };

  generateTenantToken = async (key: Key, searchRules: any, expiresAt: Date) => {
    try {
      const client = await this.getClient();
      return client.generateTenantToken(key.uid, searchRules, {
        apiKey: key.key,
        expiresAt,
      });
    } catch (e: any) {
      logger.log(`generateTenantToken error ${key}`);
      throw e;
    }
  };
}
