import { TotalChatSessionStatisticResponse, SessionStatus } from '../../models/ChatSessionStatistic';

export interface GetUserTotalSessionByStatusUseCase {
  invoke(
    tenant: string,
    username: string,
    status: SessionStatus,
  ): Promise<TotalChatSessionStatisticResponse>;
}
