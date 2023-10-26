import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { BookingStatistic } from '../../models/BookingStatistic';
import { DepartureTourStatistic } from '../../models/DepartureTourStatistic';
import { FilteringTimeRange } from '../../models/FilteringDuration';
import { LeadStatistic } from '../../models/LeadStatistic';
import { TourFillingRatioStatistic } from '../../models/TourFillingRatioStatistic';
import { ChatSessionStatistic, ChatSessionQueryParams } from '../../models/ChatSessionStatistic';

export interface TenantStatisticRepository {

  getDepartureTourStatistic(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<DepartureTourStatistic[]>;

  getLeadStatistic(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<LeadStatistic[]>;

  getLeadCreatedFromChatStatistic(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<LeadStatistic[]>;

  getBookingStatistic(
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ): Promise<BookingStatistic[]>;

  getFillingRatioStatistic(
    tenant: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<TourFillingRatioStatistic> | undefined>;

  getTotalSessionOrgByParams(
    tenant: string,
    params?: ChatSessionQueryParams,
  ): Promise<ChatSessionStatistic[]>;
}
