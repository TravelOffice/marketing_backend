import { TelegramMessage } from './TelegramMessage';

// Message with metadata
interface TelegramMessageWithMetadata extends TelegramMessage {
  metadata?: string;
}

// Telegram message content with multiple types of message
export type TelegramMessageContent = TelegramMessageWithMetadata;

export interface TelegramWebhookMessageEvent {
  sender: { id: string },
  recipient: { id: string },
  timestamp: number,
  message: TelegramMessageContent // Based on type of event
}
