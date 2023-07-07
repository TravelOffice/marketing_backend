import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { SourceRepository } from './interfaces/SourceRepository';
import { Source } from '../models/Source';
import { Lead } from '../models/Lead';
import { SOURCE_INDEX, TENANT_INDEX } from '../utils/constants';

export default class SourceRepositoryImpl implements SourceRepository {
  async get(tenantId: string, sourceId: string): Promise<Source | undefined> {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem<Lead>(
      travelTable,
      `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
      sourceId,
    );
  }
}
