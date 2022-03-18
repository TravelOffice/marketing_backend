export interface SendFacebookMessageRequestPayload {
  recipient: { id: string },
  message: {
    text: string
  },
  messaging_type?: string,
  tag?: string
}
