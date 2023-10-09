import { FilteringDuration } from '../../models/FilteringDuration';
import { TotalBookingMetricResponse } from '../../models/BookingStatistic';

export interface GetTotalBookingOfSaleUseCase {
  invoke(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration
  ): Promise<TotalBookingMetricResponse>;
}
