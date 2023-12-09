import { FilteringTimeRange } from '../../models/FilteringDuration';
import { ConversionRatioMetricResponse } from '../../models/LeadStatistic';

export interface GetConversionRatioOfTenantUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<ConversionRatioMetricResponse>;
}
