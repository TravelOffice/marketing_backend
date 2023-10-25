import { TotalChatSessionStatisticResponse, SessionStatus } from '../../models/ChatSessionStatistic';

export interface GetOrgTotalSessionByStatusUseCase {
  invoke(
    tenant: string,
    status: SessionStatus,
  ): Promise<TotalChatSessionStatisticResponse>;
}
