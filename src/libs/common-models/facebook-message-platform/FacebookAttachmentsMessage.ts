/**
 * Definitions for attachment message types, contains
 * - FacebookMediaAttachment
 * - FacebookFallbackAttachment
 * - FacebookTemplateAttachment
 */

import { BasedFacebookMessage } from './BasedFacebookMessage';

export interface FacebookMediaAttachment {
  type: 'image' | 'audio' | 'video' | 'file',
  payload: {
    url: string
  }
}

export interface FacebookFallbackAttachment {
  type: 'fallback',
  title?: string,
  url?: string,
  payload?: string,
}

export interface FacebookTemplateAttachment {
  type: 'template',
  payload: any, // // Refer to https://developers.facebook.com/docs/messenger-platform/reference/templates#available_templates
}

export type FacebookAttachment = FacebookMediaAttachment | FacebookFallbackAttachment | FacebookTemplateAttachment;

export type FacebookAttachmentsMessage = BasedFacebookMessage & {
  attachments: Array<FacebookAttachment>
}