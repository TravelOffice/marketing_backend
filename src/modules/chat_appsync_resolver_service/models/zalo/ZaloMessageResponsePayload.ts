export interface ZaloMessageResponsePayload {
  data: {
    message_id: string,
    user_id: string
  };
  error: number,
  message: string
}
