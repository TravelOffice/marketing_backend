import { MarketplaceStatistic } from '../../models/MarketplaceStatistic';

export interface GetMarketplaceStatisticUseCase {
  invoke(): Promise<MarketplaceStatistic | undefined>,
}
