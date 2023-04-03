/**
 * Definitions for text message type contains normal text and reply text message
 * - FacebookWebhookTextMessage
 * - FacebookWebhookTextReplyMessage
 */

import { BasedFacebookWebhookMessage } from './BasedFacebookWebhookMessage';

export type FacebookWebhookTextMessage = BasedFacebookWebhookMessage & {
  text: string
}

export type FacebookWebhookTextReplyMessage = FacebookWebhookTextMessage & {
  reply_to: {
    mid: string
  }
}
