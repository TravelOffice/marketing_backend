import {
  ChatPlatform, TelegramBot, TelegramMessageContent,
} from 'common-models';
import { TelegramConversationWithAssignee } from '../../models/RestrictedTelegramModels';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    tenantId: string,
    username: string,
    platform: ChatPlatform,
    message: TelegramMessageContent,
  ) => Promise<void>

  saveChatMessage: (
    tenantId: string,
    platform: ChatPlatform,
    page: TelegramBot,
    message: TelegramMessageContent
  ) => Promise<void>

  saveConversation: (
    tenantId: string,
    platform: ChatPlatform,
    page: TelegramBot,
    message: TelegramMessageContent
  ) => Promise<TelegramConversationWithAssignee>
}
