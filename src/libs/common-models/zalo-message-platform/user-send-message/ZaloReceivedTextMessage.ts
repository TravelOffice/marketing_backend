/**
 * Definitions for received text message type
 * - ZaloReceivedTextMessage
 */

import { BasedZaloReceivedMessage } from './BasedZaloReceivedMessage';

export type ZaloReceivedTextMessage = BasedZaloReceivedMessage & {
    text: string, // Content of message
}
