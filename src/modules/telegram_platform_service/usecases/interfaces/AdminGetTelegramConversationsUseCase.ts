import { RestrictedTelegramConversation } from '../../models';

export interface AdminGetTelegramConversationsUseCase {
  invoke: (
    tenantId: string,
    botId: string,
  ) => Promise<Array<RestrictedTelegramConversation>>;
}
