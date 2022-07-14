import { TelegramMessage } from './TelegramMessage';

// Telegram message content with multiple types of message
export type TelegramMessageContent = TelegramMessage;

export interface TelegramWebhookMessageEvent {
  sender: { id: string },
  recipient: { id: string },
  timestamp: number,
  message: TelegramMessageContent // Based on type of event
}
