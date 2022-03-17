/**
 * Definitions for received text message type
 * - ZaloReceivedImageMessage
 * - ZaloReceivedMediaMessage
 * - ZaloReceivedAudioMessage
 * - ZaloReceivedStikerMessage
 * - ZaloReceivedLocationMessage
 * - ZaloReceivedFileMessage
 */

import { BasedZaloReceivedMessage } from './BasedZaloReceivedMessage';

export interface ZaloReceivedImageMessage {
  payload: {
    thumbnail: string, // Display image
    url: string // Url of image
  }
  type: 'image' | 'gif'
}

export interface ZaloReceivedMediaMessage {
  payload: {
    thumbnail: string, // Display image
    url: string, // Url of link and video
    description: string // Detail of linke and video
  }
  type: 'link' | 'video'
}

export interface ZaloReceivedAudioMessage {
  payload: {
    url: string // Url of audio
  }
  type: 'audio'
}

export interface ZaloReceivedStikerMessage {
  payload: {
    id: string, // ID of sticker
    url: string // Url of sticker
  }
  type: 'sticker'
}

export interface ZaloReceivedLocationMessage {
  payload: {
    coordinates: {
      latitude: string,
      longitude: string
    }
  }
  type: 'location'
}

export interface ZaloReceivedFileMessage {
  payload: {
    size: string, // Size of file
    name: string, // Name of file
    checksum: string, // MD5 hash checksum
    type: string, // Type of file
    url: string // Download url
  }
  type: 'file'
}

export type ZaloReceivedAttachment = ZaloReceivedAudioMessage | ZaloReceivedFileMessage | ZaloReceivedImageMessage | ZaloReceivedLocationMessage | ZaloReceivedMediaMessage | ZaloReceivedStikerMessage;

export type ZaloReceivedAttachmentMessage = BasedZaloReceivedMessage & {
    text?: string,
    attachments: Array<ZaloReceivedAttachment>
}
