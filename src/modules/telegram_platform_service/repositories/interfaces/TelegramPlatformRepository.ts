import { TelegramMessage } from 'common-models';
import {
  RestrictedTelegramConversation,
  TelegramConversationWithAssignee,
  TelegramPagingMessage,
} from '../../models';
import { TelegramSendMessageData } from '../../models/send-message/SendMessageData';

export interface TelegramPlatformRepository {
  getChat: (
    tenantId: string,
    botId: string,
    chatId: string,
  ) => Promise<TelegramConversationWithAssignee>

  getConversationMessages: (
    tenantId: string,
    botId: string,
    chatId: string,
    nextToken?: string,
    limit?: number,
  ) => Promise<TelegramPagingMessage>

  getUserProfile: () => Promise<void>

  getAccessToken: (
    tenantId: string, botId: string,
  ) => Promise<string>

  sendMessage: (
    accessToken: string,
    chatId: string,
    data: TelegramSendMessageData,
  ) => Promise<TelegramMessage>

  getConversations: (
    tenantId: string,
    botId: string,
    assigneeId?: string,
  ) => Promise<Array<RestrictedTelegramConversation>>
}
