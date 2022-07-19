import {
  ChatPlatform, TelegramMessageContent,
} from 'common-models';

export interface MessageRepository {
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
