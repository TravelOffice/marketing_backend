import { SessionStatistic } from '../../models/SessionStatistic';

export interface GetOrgTotalSessionByConversationUseCase {
  invoke(
    tenant: string,
    conversationId: string,
  ): Promise<SessionStatistic>;
}
