import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { USER_INDEX } from '../utils/constants';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import { MarketplaceUser } from '../models/MarketplaceUser';

export default class MarketplaceUserRepositoryImpl
implements MarketplaceUserRepository {
  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue(
      'DYNAMO_MARKETPLACE_TABLE',
    );
    return dynamoProvider.getItem<MarketplaceUser>(
      marketplaceTable,
      USER_INDEX,
      id,
    );
  };
}
