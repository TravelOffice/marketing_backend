import { TelegramChat as TelegramConversation } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';
import { ChatPlatformMessage } from './DDBMessage';

export type ChatPlatformConversation = TelegramConversation;

export interface DDBConversation extends BaseDdbModel {
  info: ChatPlatformConversation,
  lastMessage?: ChatPlatformMessage,
}
