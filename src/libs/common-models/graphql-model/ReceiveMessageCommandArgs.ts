import { ChatPlatform } from './ChatPlatform';

export interface ReceiveMessageCommandArgs {
  id: string,
  sender: string,
  recipient: string,
  customerId: string,
  timestamp: number,
  messageData: string, // AWS AppSync support AWSJSON type, JSON must be stringified before sending to AppSync
  platform: ChatPlatform,
}
