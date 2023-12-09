import { FilteringTimeRange } from '../../models/FilteringDuration';
import { TotalRevenueMetricResponse } from '../../models/DepartureTourStatistic';

export interface GetTotalRevenueOfTenantUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<TotalRevenueMetricResponse>;
}
