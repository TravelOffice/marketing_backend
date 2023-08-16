import { MarketplaceStatistic } from '../models/statistic/MarketplaceStatistic';
import { MarketplaceStatisticRepository } from './interfaces/MarketplaceStatisticRepository';
import logger from '../utils/logger';

export default class MarketplaceStatisticRepositoryImpl implements MarketplaceStatisticRepository {
  getMarketplaceStatistic = async () => {
    throw new Error('Method not implemented.');
  };

  createMarketplaceStatistic = async (marketplaceStatistic: MarketplaceStatistic) => {
    logger.log(marketplaceStatistic);
    throw new Error('Method not implemented.');
  };

  updateMarketplaceStatistic = async (dataToUpdate: Partial<MarketplaceStatistic>) => {
    logger.log(dataToUpdate);
    throw new Error('Method not implemented.');
  };
}
