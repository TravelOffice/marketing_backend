import {
  ChatPlatform, TelegramMessageContent,
} from 'common-models';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    platform: ChatPlatform,
    assignee: string,
    message: TelegramMessageContent,
  ) => Promise<void>

  saveChatMessage: (
    tenantId: string,
    platform: ChatPlatform,
    pageId: string,
    message: TelegramMessageContent,
  ) => Promise<void>

  saveConversation: (
    tenantId: string,
    platform: ChatPlatform,
    pageId: string,
    message: TelegramMessageContent,
  ) => Promise<void>
}
