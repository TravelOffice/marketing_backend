import { ZaloSendAttachmentMessage } from './oa-send-message/ZaloSendAttachmentsMessage';
import { ZaloReplyTextMessage, ZaloSendTextMessage } from './oa-send-message/ZaloSendTextMessage';

export type ZaloSendMessageContent =
  ZaloSendTextMessage
  | ZaloReplyTextMessage
  | ZaloSendAttachmentMessage;
export interface ZaloSendMessageRequest {
  recipient: {
    user_id: string
  },
  message: ZaloSendMessageContent
}
