import { TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetUserTotalSessionByDurationUseCase {
  invoke(
    tenant: string,
    username: string,
    duration: number,
  ): Promise<TotalChatSessionStatisticResponse>;
}
