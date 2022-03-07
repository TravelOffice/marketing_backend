export interface SendZaloMessageRequestPayload {
  recipient: {
    user_id: string
  },
  message: {
    text: string
  }
}
