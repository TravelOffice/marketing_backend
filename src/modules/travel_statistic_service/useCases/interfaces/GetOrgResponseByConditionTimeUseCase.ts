import { ResponseTimeFilterParams, TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetOrgResponseByConditionTimeUseCase {
  invoke(
    tenant: string,
    filterParam: ResponseTimeFilterParams,
    startTime?: string
  ): Promise<TotalChatSessionStatisticResponse>;
}
