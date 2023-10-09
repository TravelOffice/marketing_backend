import { FilteringDuration } from '../../models/FilteringDuration';
import { ConversionRatioMetricResponse } from '../../models/LeadStatistic';

export interface GetConversionRatioOfSaleUseCase {
  invoke(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<ConversionRatioMetricResponse>;
}
