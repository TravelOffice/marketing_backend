import { BookingStatistic } from '../../models/BookingStatistic';
import { DepartureTourStatistic } from '../../models/DepartureTourStatistic';
import { FilteringDuration } from '../../models/FilteringDuration';
import { LeadStatistic } from '../../models/LeadStatistic';
import { TourFillingRatioStatistic } from '../../models/TourFillingRatioStatistic';

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

  getFillingRatioStatistic(tenant: string): Promise<TourFillingRatioStatistic[]>;
}
