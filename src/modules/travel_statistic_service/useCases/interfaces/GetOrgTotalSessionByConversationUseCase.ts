import { TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetOrgTotalSessionByConversationUseCase {
  invoke(
    tenant: string,
    conversationId: string,
  ): Promise<TotalChatSessionStatisticResponse>;
}
