import { BookingStatistic } from '../../models/BookingStatistic';
import { FilteringTimeRange } from '../../models/FilteringDuration';
import { LeadStatistic } from '../../models/LeadStatistic';

export interface SaleStatisticRepository {
  getLeadStatistic(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<LeadStatistic[]>;

  getBookingStatistic(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<BookingStatistic[]>;
}
