import { Message as TelegramMessage } from 'telegrambot';
import { BaseDdbModel } from './BaseDdbModel';

export type ChatPlatformMessage = TelegramMessage;

export interface Message extends BaseDdbModel {
  content: ChatPlatformMessage,
}
