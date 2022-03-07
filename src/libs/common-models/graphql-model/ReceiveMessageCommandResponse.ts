import { ChatPlatform } from "./ChatPlatformEnum"

export interface ReceiveMessageCommandResponse {
  data: {
    id: string,
    sender: string,
    recipient: string,
    customerId: string,
    timestamp:number,
    messageData: any,
  }, // GraphQL model
  message: string // Query result as string
}
