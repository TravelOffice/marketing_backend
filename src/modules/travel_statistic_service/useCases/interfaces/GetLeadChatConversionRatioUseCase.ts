import { FilteringTimeRange } from '../../models/FilteringDuration';
import { ConversionRatioMetricResponse } from '../../models/LeadStatistic';

export interface GetLeadChatConversionRatioUseCase {
  invoke(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<ConversionRatioMetricResponse>;
}
