import { AppsyncZaloSendMessageData } from 'common-models';

export interface SendZaloMessageRequestPayload {
  recipient: {
    user_id: string
  },
  message: AppsyncZaloSendMessageData
}

export interface SendZaloMessageResponsePayload {
  data: {
    message_id: string,
    user_id: string
  },
  error: number,
  message: string
}
