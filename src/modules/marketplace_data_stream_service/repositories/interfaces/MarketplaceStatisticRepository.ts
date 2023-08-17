import { MarketplaceStatistic } from '../../models/statistic/MarketplaceStatistic';

export interface MarketplaceStatisticRepository {
  getMarketplaceStatistic(): Promise<MarketplaceStatistic>;
  createMarketplaceStatistic(
    marketplaceStatistic: MarketplaceStatistic,
  ): Promise<MarketplaceStatistic>;
  updateMarketplaceStatistic(
    dataToUpdate: Partial<MarketplaceStatistic>,
  ): Promise<MarketplaceStatistic>;
}
