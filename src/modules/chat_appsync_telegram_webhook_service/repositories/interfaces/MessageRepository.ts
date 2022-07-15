import {
  ChatPlatform, TelegramBot, TelegramMessageContent,
} from 'common-models';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    tenantId: string,
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
  ) => Promise<void>
}
