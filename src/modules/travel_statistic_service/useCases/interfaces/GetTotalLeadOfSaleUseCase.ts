import { FilteringTimeRange } from '../../models/FilteringDuration';
import { TotalLeadMetricResponse } from '../../models/LeadStatistic';

export interface GetTotalLeadOfSaleUseCase {
  invoke(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<TotalLeadMetricResponse>;
}
