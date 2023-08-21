import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { MarketplaceStatistic } from '../models/MarketplaceStatistic';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import { OrganizationStatistic } from '../models/OrganizationStatistic';
import {
  MARKETPLACE_STATISTIC_PK,
  statisticTable,
  MARKETPLACE_STATISTIC_SK,
} from '../utils/constants';

export default class MarketplaceStatisticRepositoryImpl
implements MarketplaceStatisticRepository {
  getMarketplaceStatistic = async (): Promise<
    MarketplaceStatistic | undefined
  > => {
    const marketplaceTable = await getAwsSecretValue(
      statisticTable,
    );
    return dynamoProvider.getItem<MarketplaceStatistic>(
      marketplaceTable,
      MARKETPLACE_STATISTIC_PK,
      MARKETPLACE_STATISTIC_SK,
    );
  };

  getOrganizationStatistic = async (
    orgId: string,
  ): Promise<OrganizationStatistic | undefined> => {
    const marketplaceTable = await getAwsSecretValue(
      statisticTable,
    );
    return dynamoProvider.getItem<OrganizationStatistic>(
      marketplaceTable,
      MARKETPLACE_STATISTIC_PK,
      `ORG_STATS#${orgId}`,
    );
  };
}
