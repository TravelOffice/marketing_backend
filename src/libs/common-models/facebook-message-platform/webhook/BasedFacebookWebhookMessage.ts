// Based information of message content that is received from webhook
export type BasedFacebookWebhookMessage = {
  mid: string, // ID of message
  is_echo?: boolean, // Indicates the message sent from the page itself
  app_id?: string, // ID of the app from which the message was sent
  metadata?: string, // Developer defined metadata as a string
}
