/**
 * Definitions for received text message type
 * - ZaloSendImageMessage
 * - ZaloSendGIFMessage
 * - ZaloSendFileMessage
 */


export type ZaloSendImageMessage = {
  payload: {
    template_type: 'media', // Display image
    elements: [{
      media_type: 'image',
      attachment_id: string // ID returned from upload image api
    }]
  }
  type: 'template'
}

export type ZaloSendGIFMessage = {
  payload: {
    template_type: 'media', // Display image
    elements: [{
      media_type: 'gif',
      attachment_id: string, // ID returned from upload image api
      width: number, // Width of image
      height: number // Heigh of image
    }]
  }
  type: 'template'
}

export type ZaloSendFileMessage = {
  payload: {
    token: string // Token returned form upload file api
  }
  type: 'file'
}

export type ZaloSendAttachment = ZaloSendImageMessage | ZaloSendGIFMessage | ZaloSendFileMessage
export type ZaloSendAttachmentMessage = {
  text?: string,
  attachments: ZaloSendAttachment
}
