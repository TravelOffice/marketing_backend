

export interface BasedFacebookSendMessageContent {
  metadata?: string, // Custom string that is delivered as a message echo. 1000 character limit.
  quick_replies?: Array<any>, // https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
}

export type FacebookSendTextMessageContent = BasedFacebookSendMessageContent & {
  text: string // Text content to send to user
}


// Refer to https://developers.facebook.com/docs/messenger-platform/reference/send-api/#attachment
export type AttachmentType = 'image' | 'audio' | 'video' | 'file'; // `template` type will be supported later
export type FacebookSendAttachmentMessageContent = BasedFacebookSendMessageContent & {
  attachment: {
    type: AttachmentType,
    payload: {
      url: string,
      is_reusable: boolean, // Set to true to make the saved asset sendable to other message recipients. Defaults to false.
    }
  }
}

export type FacebookSendMessageContent = FacebookSendTextMessageContent | FacebookSendAttachmentMessageContent;