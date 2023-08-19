import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { MarketplaceStatistic } from '../models/MarketplaceStatistic';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import { OrganizationStatistic } from '../models/OrganizationStatistic';

export default class MarketplaceStatisticRepositoryImpl
implements MarketplaceStatisticRepository {
  getMarketplaceStatistic = async (): Promise<MarketplaceStatistic | undefined> => {
    const marketplaceTable = await getAwsSecretValue(
      'DYNAMO_MARKETPLACE_TABLE',
    );
    return dynamoProvider.getItem<OrganizationStatistic>(
      marketplaceTable,
      'STATS',
      'MARKETPLACE_STATS',
    );
  };

  getOrganizationStatistic = async (orgId: string): Promise<OrganizationStatistic | undefined> => {
    const marketplaceTable = await getAwsSecretValue(
      'DYNAMO_MARKETPLACE_TABLE',
    );
    return dynamoProvider.getItem<OrganizationStatistic>(
      marketplaceTable,
      'STATS',
      `ORG_STATS#${orgId}`,
    );
  };
}
