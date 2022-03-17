import { ZaloReceivedAttachmentMessage } from './user-send-message/ZaloReceivedAttachmentsMessage'
import { ZaloReceivedTextMessage } from './user-send-message/ZaloReceivedTextMessage';

// Type of message that user can send to official account
export enum USER_SEND_EVENTS {
  TEXT = 'user_send_text',
  IMAGE = 'user_send_image',
  LINK = 'user_send_link',
  AUDIO = 'user_send_audio',
  VIDEO = 'user_send_video',
  STICKER = 'user_send_sticker',
  LOCATION = 'user_send_location',
  BUSINESS_CARD = 'user_send_business_card',
  FILE = 'user_send_file',
}

export interface ZaloWebhookMessageEvent {
  app_id: string,
  sender: { id: string },
  recipient: { id: string },
  event_name: USER_SEND_EVENTS,
  timestamp: number,
  user_id_by_app: string,
  message: ZaloReceivedMessageContent // Based on type of event
}

export type ZaloReceivedMessageContent = ZaloReceivedTextMessage | ZaloReceivedAttachmentMessage;
