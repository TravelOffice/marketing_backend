import { FacebookAttachmentsMessageWebhook as FacebookWebhookAttachmentsMessage } from './FacebookWebhookAttachmentsMessage';
import { FacebookWebhookTextMessage, FacebookWebhookTextReplyMessage } from './FacebookWebhookTextMessage';

// Facebook message content with three types of message
export type FacebookWebhookMessageContent =
  FacebookWebhookTextMessage
  | FacebookWebhookTextReplyMessage
  | FacebookWebhookAttachmentsMessage;

export interface FacebookWebhookMessageEvent {
  sender: { id: string },
  recipient: { id: string },
  timestamp: number,
  message: FacebookWebhookMessageContent // Based on type of event
}
