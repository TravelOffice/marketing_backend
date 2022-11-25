import { ZaloConversation } from '../zalo-message-platform';
import { FacebookConversation } from '../facebook-message-platform';
import { TelegramChat as TelegramConversation } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';
import { ChatPlatformMessage } from './DDBMessage';

export type ChatPlatformConversation =
  TelegramConversation | FacebookConversation | ZaloConversation;

export interface DDBConversation extends BaseDdbModel {
  info: ChatPlatformConversation,
  lastMessage?: ChatPlatformMessage,
}
