import { FilteringDuration } from '../../models/FilteringDuration';
import { BookingStatistic, LeadStatistic } from '../../models/TenantStatistic';

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
