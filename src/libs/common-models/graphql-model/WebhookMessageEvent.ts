export interface WebhookMessageEvent {
  sender: { id: string },
  recipient: {id: string},
  timestamp: number,
  message: any // Based on type of event
}
