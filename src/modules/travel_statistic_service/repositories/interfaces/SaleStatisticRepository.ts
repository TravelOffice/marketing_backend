import { BookingStatistic } from '../../models/BookingStatistic';
import { FilteringDuration } from '../../models/FilteringDuration';
import { LeadStatistic } from '../../models/LeadStatistic';

export interface SaleStatisticRepository {
  getLeadStatistic(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<LeadStatistic[]>;

  getBookingStatistic(
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ): Promise<BookingStatistic[]>;
}
