import { MarketplaceStatistic } from '../../models/MarketplaceStatistic';
import { OrganizationStatistic } from '../../models/OrganizationStatistic';

export interface MarketplaceStatisticRepository {
  getMarketplaceStatistic(): Promise<MarketplaceStatistic | undefined>,
  getOrganizationStatistic(organization: string): Promise<OrganizationStatistic | undefined>,
}
