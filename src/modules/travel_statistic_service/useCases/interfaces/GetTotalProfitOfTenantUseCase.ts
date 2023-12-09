import { FilteringTimeRange } from '../../models/FilteringDuration';
import { TotalProfitMetricResponse } from '../../models/DepartureTourStatistic';

export interface GetTotalProfitOfTenantUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<TotalProfitMetricResponse>;
}
