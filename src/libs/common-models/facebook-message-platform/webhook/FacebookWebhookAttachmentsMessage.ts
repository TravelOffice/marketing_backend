/**
 * Definitions for attachment message types, contains
 * - FacebookMediaAttachmentWebhook
 * - FacebookFallbackAttachmentWebhook
 * - FacebookTemplateAttachmentWebhook
 */

import { BasedFacebookWebhookMessage } from './BasedFacebookWebhookMessage';

export interface FacebookWebhookMediaAttachment {
  type: 'image' | 'audio' | 'video' | 'file',
  payload: {
    url: string
  }
}

export interface FacebookWebhookFallbackAttachment {
  type: 'fallback',
  title?: string,
  url?: string,
  payload?: string,
}

export interface FacebookWebhookTemplateAttachment {
  type: 'template',
  payload: any, // // Refer to https://developers.facebook.com/docs/messenger-platform/reference/templates#available_templates
}

export type FacebookWebhookAttachment =
  FacebookWebhookMediaAttachment
  | FacebookWebhookFallbackAttachment
  | FacebookWebhookTemplateAttachment;

export type FacebookAttachmentsMessageWebhook = BasedFacebookWebhookMessage & {
  attachments: Array<FacebookWebhookAttachment>
}
