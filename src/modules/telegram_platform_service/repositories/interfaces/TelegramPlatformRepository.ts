import { SendMessageOptions, TelegramMessage } from 'common-models';
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
  getAccessToken: (
    tenantId: string, botId: string,
  ) => Promise<string>
  sendTextMessage: (
    accessToken: string,
    chatId: string,
    text: string,
    options?: SendMessageOptions,
  ) => Promise<TelegramMessage>,
  getConversations: (
    tenantId: string,
    botId: string,
    assigneeId?: string,
  ) => Promise<Array<RestrictedTelegramConversation>>,
}
