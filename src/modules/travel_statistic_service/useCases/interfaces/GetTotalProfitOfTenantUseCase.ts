import { FilteringDuration } from '../../models/FilteringDuration';
import { TotalProfitMetricResponse } from '../../models/DepartureTourStatistic';

export interface GetTotalProfitOfTenantUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringDuration,
  ): Promise<TotalProfitMetricResponse>;
}
