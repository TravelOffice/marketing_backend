import { ResponseTimeFilterParams, SessionStatistic } from '../../models/SessionStatistic';

export interface GetOrgResponseByConditionTimeUseCase {
  invoke(
    tenant: string,
    filterParam: ResponseTimeFilterParams,
    startTime?: string
  ): Promise<SessionStatistic>;
}
