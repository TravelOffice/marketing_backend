import { AppsyncZaloSendMessageData } from "common-models"

export interface SendZaloMessageRequestPayload {
  recipient: {
    user_id: string
  },
  message: AppsyncZaloSendMessageData
}
