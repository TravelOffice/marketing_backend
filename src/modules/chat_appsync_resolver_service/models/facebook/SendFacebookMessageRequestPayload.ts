export interface SendFacebookMessageRequestPayload {
  recipient: { id: string },
  message: {
    text: string
  }
}
