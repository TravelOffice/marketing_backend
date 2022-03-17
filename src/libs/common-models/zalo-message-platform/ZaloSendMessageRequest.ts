import { ZaloSendAttachmentMessage } from "./oa-send-message/ZaloSendAttachmentsMessage";
import { ZaloReplyTextMessage, ZaloSendTextMessage } from "./oa-send-message/ZaloSendTextMessage";

export interface ZaloSendMessageRequest {
  recipient: {
    user_id: string
  },
  message: ZaloSendMessageContent
}

export type ZaloSendMessageContent = ZaloSendTextMessage | ZaloReplyTextMessage | ZaloSendAttachmentMessage;
