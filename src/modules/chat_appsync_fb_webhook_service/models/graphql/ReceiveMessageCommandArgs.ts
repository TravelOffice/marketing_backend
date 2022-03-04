export interface ReceiveMessageCommandArgs {
  id: string,
  sender: string,
  recipient: string,
  customerId: string,
  timestamp: number,
  messageData: string,
}
