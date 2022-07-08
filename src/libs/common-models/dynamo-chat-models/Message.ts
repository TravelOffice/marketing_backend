import { Message as TelegramMessage } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';

export type ChatPlatformMessage = TelegramMessage;

export interface Message extends BaseDdbModel {
  content: ChatPlatformMessage,
}
