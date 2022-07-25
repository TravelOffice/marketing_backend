import { FacebookMessageContent } from '../facebook-message-platform';
import { TelegramMessage } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';

export type ChatPlatformMessage = TelegramMessage | FacebookMessageContent;

export interface DDBMessage extends BaseDdbModel {
  content: ChatPlatformMessage,
}
