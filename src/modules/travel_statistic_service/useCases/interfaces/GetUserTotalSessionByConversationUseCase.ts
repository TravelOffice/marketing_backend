import { SessionStatistic } from '../../models/SessionStatistic';

export interface GetUserTotalSessionByConversationUseCase {
  invoke(
    tenant: string,
    username: string,
    conversationId: string,
  ): Promise<SessionStatistic>;
}
