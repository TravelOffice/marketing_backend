// Based information of message content that any received zalo messages can have
export type BasedZaloReceivedMessage = {
  msg_id: string, // ID of message
  from_id: string,
  to_id: string,
  from_display_name: string,
  from_avatar: string,
  to_display_name: string,
  to_avatar: string,
  time: number,
  metadata?: string // metadata of message
}
