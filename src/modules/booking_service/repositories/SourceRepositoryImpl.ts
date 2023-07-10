import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { SourceRepository } from './interfaces/SourceRepository';
import { SOURCE_INDEX, TENANT_INDEX } from '../utils/constants';
import { Source } from '../models/Source';

export default class SourceRepositoryImpl implements SourceRepository {
  async get(tenantId: string, sourceId: string): Promise<Source | undefined> {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem<Source>(
      travelTable,
      `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
      sourceId,
    );
  }
}
