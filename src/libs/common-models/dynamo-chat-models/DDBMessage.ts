import { ZaloReceivedMessageContent } from '../zalo-message-platform';
import { FacebookMessage } from '../facebook-message-platform';
import { TelegramMessage } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';

export type ChatPlatformMessage =
  TelegramMessage | FacebookMessage | ZaloReceivedMessageContent;

export interface DDBMessage extends BaseDdbModel {
  content: ChatPlatformMessage,
}
