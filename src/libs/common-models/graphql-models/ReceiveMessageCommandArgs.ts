import { ChatPlatform } from './ChatPlatform';

export interface ReceiveMessageCommandArgs {
  id: string,
  sender: string,
  recipient: string,
  customerId: string,
  timestamp: number,
  // AWS AppSync support AWSJSON type, JSON must be stringified before sending to AppSync
  messageData: string,
  chatPlatform: ChatPlatform,
  username: string,
  tenant: string,
}
