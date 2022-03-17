/**
 * Definitions for received text message type
 * - ZaloReceivedTextMessage
 */

export type ZaloSendTextMessage = {
    text: string, // Content of message
}

export type ZaloReplyTextMessage = {
    text: string, // Content of reply message
    quote_message_id: string // ID of message wanted to reply
}
