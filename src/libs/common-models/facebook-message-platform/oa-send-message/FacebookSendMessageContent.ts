export interface BasedFacebookSendMessageContent {
  // Custom string that is delivered as a message echo. 1000 characters limit.
  metadata?: string,
  // Detail https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
  quick_replies?: Array<any>,
}

export type FacebookSendTextMessageContent =
  BasedFacebookSendMessageContent & {
    text: string // Text content to send to user
  }

// Refer to https://developers.facebook.com/docs/messenger-platform/reference/send-api/#attachment
export type AttachmentType = 'image' | 'audio' | 'video' | 'file'; // `template` type will be supported later
export type FacebookSendAttachmentMessageContent =
  BasedFacebookSendMessageContent & {
    attachment: {
      type: AttachmentType,
      payload: {
        url: string,
        // Set to true to make the saved asset can be sent to other message recipients.
        // Defaults to false.
        is_reusable: boolean,
      }
    }
  }

export type FacebookSendMessageContent =
  FacebookSendTextMessageContent
  | FacebookSendAttachmentMessageContent;
