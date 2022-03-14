/**
 * Definitions for text message type contains normal text and reply text message
 * - FacebookTextMessage
 * - FacebookTextReplyMessage
 */

import { BasedFacebookMessage } from './BasedFacebookMessage';

export type FacebookTextMessage = BasedFacebookMessage & {
  text: string
}

export type FacebookTextReplyMessage = FacebookTextMessage & {
  reply_to: {
    mid: string
  }
}