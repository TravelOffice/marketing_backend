import { TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetOrgTotalSessionUseCase {
  invoke(
    tenant: string,
  ): Promise<TotalChatSessionStatisticResponse>;
}
