// Based information of message content that any facebook message can have
export type BasedFacebookMessage = {
  mid: string, // Id of message
  is_echo?: boolean, // Indicates the message sent from the page itself
  app_id?: string, // ID of the app from which the message was sent
  metadata?: string, // Developer defined metadata as a string
}