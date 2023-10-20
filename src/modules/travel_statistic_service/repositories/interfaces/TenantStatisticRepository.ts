import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BookingStatistic } from '../../models/BookingStatistic';
import { DepartureTourStatistic } from '../../models/DepartureTourStatistic';
import { FilteringDuration } from '../../models/FilteringDuration';
import { LeadStatistic } from '../../models/LeadStatistic';
import { TourFillingRatioStatistic } from '../../models/TourFillingRatioStatistic';
import { Session, SessionQueryParams } from '../../models/SessionStatistic';

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

  getFillingRatioStatistic(
    tenant: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<TourFillingRatioStatistic> | undefined>;

  getTotalSessionOrgByParams(
    tenant: string,
    params?: SessionQueryParams,
  ): Promise<Session[]>;
}
