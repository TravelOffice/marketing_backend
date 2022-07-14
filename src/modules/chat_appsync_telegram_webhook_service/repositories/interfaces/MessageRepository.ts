import {
  ChatPlatform, TelegramMessageContent,
} from 'common-models';
import { Page } from '../../models/Page';

export interface MessageRepository {
  sendReceivedMessageCommand: (
    tenantId: string,
    platform: ChatPlatform,
    message: TelegramMessageContent,
  ) => Promise<void>

  saveChatMessage: (
    tenantId: string,
    platform: ChatPlatform,
    page: Page,
    message: TelegramMessageContent
  ) => Promise<void>

  saveConversation: (
    tenantId: string,
    platform: ChatPlatform,
    page: Page,
    message: TelegramMessageContent
  ) => Promise<void>
}
