import { TotalChatSessionStatisticResponse } from '../../models/ChatSessionStatistic';

export interface GetUserTotalSessionByConversationUseCase {
  invoke(
    tenant: string,
    username: string,
    conversationId: string,
  ): Promise<TotalChatSessionStatisticResponse>;
}
