import { AppSyncMessageData } from 'standardized-platform-models';

export interface ReceiveMessageCommandResponse {
  data: {
    id: string,
    sender: string,
    recipient: string,
    customerId: string,
    timestamp:number,
    messageData: AppSyncMessageData,
  }, // GraphQL model
  message: string // Query result as string
}
