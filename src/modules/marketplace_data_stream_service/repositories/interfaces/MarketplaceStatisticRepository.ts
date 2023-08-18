import { MarketplaceStatistic } from '../../models/statistic/MarketplaceStatistic';

export interface MarketplaceStatisticRepository {
  getMarketplaceStatistic(): Promise<MarketplaceStatistic | undefined>;
  createMarketplaceStatistic(
    marketplaceStatistic: MarketplaceStatistic,
  ): Promise<MarketplaceStatistic>;
  updateMarketplaceStatistic(
    dataToUpdate: Partial<MarketplaceStatistic>,
  ): Promise<MarketplaceStatistic>;
}
