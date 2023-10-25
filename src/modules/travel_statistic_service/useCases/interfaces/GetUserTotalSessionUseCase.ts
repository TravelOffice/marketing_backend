import { TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetUserTotalSessionUseCase {
  invoke(
    tenant: string,
    username: string,
  ): Promise<TotalChatSessionStatisticResponse>;
}
