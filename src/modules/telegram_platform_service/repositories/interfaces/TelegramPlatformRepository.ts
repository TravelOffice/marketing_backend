import { RestrictedTelegramConversation } from '../../models';

export interface TelegramPlatformRepository {
  getChat: () => Promise<void>,
  getUserProfile: () => Promise<void>,
  sendMessage: () => Promise<void>,
  getConversations: (
    tenantId: string,
    botId: string,
    assigneeId: string,
  ) => Promise<Array<RestrictedTelegramConversation>>,
}
