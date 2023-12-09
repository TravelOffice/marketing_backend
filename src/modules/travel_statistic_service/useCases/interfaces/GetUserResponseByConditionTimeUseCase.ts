import { ResponseTimeFilterParams, TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetUserResponseByConditionTimeUseCase {
  invoke(
    tenant: string,
    username: string,
    filterParam: ResponseTimeFilterParams,
    startTime?: string
  ): Promise<TotalChatSessionStatisticResponse>;
}
