import { FilteringDuration } from '../../models/FilteringDuration';
import {
  BookingStatistic,
  DepartureTourStatistic,
  FillingRatioStatistic,
  LeadStatistic,
} from '../../models/TenantStatistic';

export interface TenantStatisticRepository {

  getDepartureTourStatistic(
    tenant: string,
    filteringDuration?: FilteringDuration,
  ): Promise<DepartureTourStatistic[]>;

  getLeadStatistic(tenant: string, filteringDuration?: FilteringDuration): Promise<LeadStatistic[]>;

  getBookingStatistic(
    tenant: string,
    filteringDuration?: FilteringDuration,
  ): Promise<BookingStatistic[]>;

  getFillingRatioStatistic(tenant: string): Promise<FillingRatioStatistic[]>;
}
