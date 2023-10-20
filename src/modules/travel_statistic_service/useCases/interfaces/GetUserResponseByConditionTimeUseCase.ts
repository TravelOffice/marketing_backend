import { ResponseTimeFilterParams, SessionStatistic } from '../../models/SessionStatistic';

export interface GetUserResponseByConditionTimeUseCase {
  invoke(
    tenant: string,
    username: string,
    filterParam: ResponseTimeFilterParams,
    startTime?: string
  ): Promise<SessionStatistic>;
}
