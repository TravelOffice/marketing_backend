/**
 * Definitions for received text message type
 * - ZaloReceivedTextMessage
 */

import { BasedZaloSendMessage } from './BasedZaloSendMessage';

export type ZaloSendTextMessage = BasedZaloSendMessage & {
    text: string, // Content of message
}

export type ZaloReplyTextMessage = BasedZaloSendMessage & {
    text: string, // Content of reply message
    quote_message_id: string // ID of message wanted to reply
}
