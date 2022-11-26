import { FileOptions } from 'common-models';
import { TelegramAttachmentContent, TelegramSendMessageOptions } from './SendMessageOptions';
import { SendMessageType } from './SendMessageType';

export interface TelegramSendMessageData {
  // Message type
  messageType: SendMessageType,
  // Text message content
  text?: string,
  metadata?: string,
  /**
   * Content to send
   * - string (url) | Buffer | Stream for file message
   * Note: File message can be photo, audio, video, document
   */
  attachment?: TelegramAttachmentContent,
  // Send message options according to type of message
  options?: TelegramSendMessageOptions,
  // File options object includes file name and content type
  fileOptions?: FileOptions,
}
