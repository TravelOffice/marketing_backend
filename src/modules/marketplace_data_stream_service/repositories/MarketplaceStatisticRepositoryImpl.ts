import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { MarketplaceStatistic } from '../models/statistic/MarketplaceStatistic';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import logger from '../utils/logger';
import { MARKETPLACE_STATISTIC_INDEX, STATISTIC_INDEX } from '../utils/constants';

export default class MarketplaceStatisticRepositoryImpl implements MarketplaceStatisticRepository {
  getMarketplaceStatistic = async () => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const statisticItem = await dynamoProvider.getItem<MarketplaceStatistic>(
      marketplaceTable,
      STATISTIC_INDEX,
      MARKETPLACE_STATISTIC_INDEX,
    );
    if (!statisticItem) return undefined;

    logger.log(`Get marketplace statistic successfully: ${JSON.stringify(statisticItem)}`);
    return statisticItem;
  };

  createMarketplaceStatistic = async (marketplaceStatistic: MarketplaceStatistic) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    await dynamoProvider.putItem(
      marketplaceTable,
      STATISTIC_INDEX,
      MARKETPLACE_STATISTIC_INDEX,
      marketplaceStatistic,
    );
    logger.log(`Create marketplace statistic successfully: ${JSON.stringify(marketplaceStatistic)}`);
    return marketplaceStatistic;
  };

  updateMarketplaceStatistic = async (dataToUpdate: Partial<MarketplaceStatistic>) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const { Attributes: marketplaceStatistic } = await dynamoProvider.updateItemWithSetExpression(
      marketplaceTable,
      STATISTIC_INDEX,
      MARKETPLACE_STATISTIC_INDEX,
      dataToUpdate,
    );

    logger.log(`Update marketplace statistic successfully: ${JSON.stringify(marketplaceStatistic)}`);
    return marketplaceStatistic as MarketplaceStatistic;
  };
}
