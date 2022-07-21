import {
  SendAudioOptions, SendDocumentOptions, SendMessageOptions, SendPhotoOptions, SendVideoOptions,
} from 'common-models';
import { Stream } from 'stream';

export type TelegramSendMessageOptions =
  SendMessageOptions
  | SendPhotoOptions
  | SendDocumentOptions
  | SendAudioOptions
  | SendVideoOptions;

export type TelegramAttachmentContent = string | Stream | Buffer;
