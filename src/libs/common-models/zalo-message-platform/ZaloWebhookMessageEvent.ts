import { ZaloReceivedAttachmentMessage } from './user-send-message/ZaloReceivedAttachmentsMessage';
import { ZaloReceivedTextMessage } from './user-send-message/ZaloReceivedTextMessage';

// Type of message that user can send to official account
export enum USER_SEND_EVENTS {
  USER_TEXT = 'user_send_text',
  USER_IMAGE = 'user_send_image',
  USER_GIF = 'user_send_gif',
  USER_LINK = 'user_send_link',
  USER_AUDIO = 'user_send_audio',
  USER_VIDEO = 'user_send_video',
  USER_STICKER = 'user_send_sticker',
  USER_FILE = 'user_send_file',
}

export enum ANONYMOUS_SEND_EVENTS {
  ANONYMOUS_TEXT = 'anonymous_send_text',
  ANONYMOUS_IMAGE = 'anonymous_send_image',
  ANONYMOUS_STICKER = 'anonymous_send_sticker',
  ANONYMOUS_FILE = 'anonymous_send_file',
}

export enum OA_SEND_EVENTS {
  OA_TEXT = 'oa_send_text',
  OA_IMAGE = 'oa_send_image',
  OA_LIST = 'oa_send_list',
  OA_GIF = 'oa_send_gif',
  OA_FILE = 'oa_send_file',
  OA_STICKER = 'oa_send_sticker',
  OA_ANONYMOUS_TEXT = 'oa_send_anonymous_text',
  OA_ANONYMOUS_IMAGE = 'oa_send_anonymous_image',
  OA_ANONYMOUS_FILE = 'oa_send_anonymous_file',
  OA_ANONYMOUS_STICKER = 'oa_send_anonymous_sticker'
}

export type ZaloReceivedMessageContent = ZaloReceivedTextMessage | ZaloReceivedAttachmentMessage;

export interface ZaloWebhookMessageEvent {
  app_id: string,
  sender: { id: string },
  recipient: { id: string },
  event_name: USER_SEND_EVENTS | ANONYMOUS_SEND_EVENTS | OA_SEND_EVENTS,
  timestamp: string,
  user_id_by_app: string,
  message: ZaloReceivedMessageContent // Based on type of event
}
