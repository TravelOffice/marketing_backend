import { Chat as TelegramConversation } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';
import { ChatPlatformMessage } from './Message';

export type ChatPlatformConversation = TelegramConversation;

export interface Conversation extends BaseDdbModel {
  info: ChatPlatformConversation,
  lastMessage?: ChatPlatformMessage,
}
