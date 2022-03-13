import { FacebookAttachmentsMessage } from './FacebookAttachmentsMessage';
import { FacebookTextMessage, FacebookTextReplyMessage } from './FacebookTextMessage';

export interface FacebookWebhookMessageEvent {
  sender: { id: string },
  recipient: { id: string },
  timestamp: number,
  message: FacebookMessageContent // Based on type of event
}

// Facebook message content with three types of message
export type FacebookMessageContent = FacebookTextMessage | FacebookTextReplyMessage | FacebookAttachmentsMessage;
