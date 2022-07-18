import {
  RestrictedTelegramConversation,
  TelegramConversationWithAssignee,
  TelegramPagingMessage,
} from '../../models';

export interface TelegramPlatformRepository {
  getChat: (
    tenantId: string,
    botId: string,
    chatId: string,
  ) => Promise<TelegramConversationWithAssignee>,
  getConversationMessages: (
    tenantId: string,
    botId: string,
    chatId: string,
    nextToken?: string,
    limit?: number,
  ) => Promise<TelegramPagingMessage>,
  getUserProfile: () => Promise<void>,
  sendMessage: () => Promise<void>,
  getConversations: (
    tenantId: string,
    botId: string,
    assigneeId?: string,
  ) => Promise<Array<RestrictedTelegramConversation>>,
}
