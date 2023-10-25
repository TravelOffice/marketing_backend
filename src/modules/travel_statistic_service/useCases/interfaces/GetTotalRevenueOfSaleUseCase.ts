import { FilteringTimeRange } from '../../models/FilteringDuration';
import { TotalRevenueMetricResponse } from '../../models/DepartureTourStatistic';

export interface GetTotalRevenueOfSaleUseCase {
  invoke(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<TotalRevenueMetricResponse>;
}
