import { QueryInput, dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { MarketplaceUser } from '../models/MarketplaceUser';
import { MARKETPLACE_USER_INDEX } from '../utils/constants';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';

export default class MarketplaceUserRepositoryImpl implements MarketplaceUserRepository {
  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const marketplaceUser = await dynamoProvider.getItem<MarketplaceUser>(
      marketplaceTable,
      MARKETPLACE_USER_INDEX,
      id,
    );
    if (!marketplaceUser) return undefined;
    return helper.excludeDataFromObject(marketplaceUser);
  };

  getByAlias = async (alias: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const params: QueryInput = {
      TableName: marketplaceTable,
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk and lsi2 = :lsi2',
      ExpressionAttributeValues: {
        ':pk': MARKETPLACE_USER_INDEX,
        ':lsi2': alias,
      },
    };
    const [marketplaceUser] = await dynamoProvider.query<MarketplaceUser>(params);
    return helper.excludeDataFromObject(marketplaceUser);
  };
}
