import { RestrictedTelegramConversation } from '../../models';

export interface GetTelegramConversationsUseCase {
  invoke: (
    tenantId: string,
    botId: string,
    assigneeId: string,
  ) => Promise<Array<RestrictedTelegramConversation>>;
}
