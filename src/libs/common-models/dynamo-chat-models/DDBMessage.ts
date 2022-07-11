import { TelegramMessage } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';

export type ChatPlatformMessage = TelegramMessage;

export interface DDBMessage extends BaseDdbModel {
  content: ChatPlatformMessage,
}
