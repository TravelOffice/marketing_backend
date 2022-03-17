import { AppSyncMessageData } from '../standardized-platform-models';
import { ChatPlatform } from './ChatPlatform';

export interface ReceiveMessageCommandResponse {
  data: {
    id: string,
    sender: string,
    recipient: string,
    customerId: string,
    timestamp:number,
    messageData: AppSyncMessageData,
    chatPlatform: ChatPlatform,
  }, // GraphQL model
  message: string // Query result as string
}
