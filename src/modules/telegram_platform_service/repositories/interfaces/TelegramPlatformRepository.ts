import {
  TelegramMessage,
} from 'common-models';
import {
  GroupWithAvatar,
  RestrictedTelegramConversation,
  RestrictedTelegramFile,
  TelegramConversationWithAssignee,
  TelegramPagingMessage,
  UserWithAvatar,
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

  getUserProfile: (
    tenantId: string,
    botId: string,
    chatId: string,
    userId: string,
  ) => Promise<UserWithAvatar>,

  getGroupProfile: (
    tenantId: string,
    botId: string,
    chatId: string,
  ) => Promise<GroupWithAvatar>,

  getAccessToken: (
    botId: string,
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
  ) => Promise<Array<RestrictedTelegramConversation>>,

  getFileInfo: (
    tenantId: string,
    accessToken: string,
    chatId: string,
    fileId: string,
  ) => Promise<RestrictedTelegramFile>,
}
