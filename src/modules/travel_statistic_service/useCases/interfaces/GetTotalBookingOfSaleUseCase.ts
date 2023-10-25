import { FilteringTimeRange } from '../../models/FilteringDuration';
import { TotalBookingMetricResponse } from '../../models/BookingStatistic';

export interface GetTotalBookingOfSaleUseCase {
  invoke(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringTimeRange
  ): Promise<TotalBookingMetricResponse>;
}
