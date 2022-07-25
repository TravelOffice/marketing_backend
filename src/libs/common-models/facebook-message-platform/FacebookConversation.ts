export interface FacebookConversation {
  id: string,
  snippet: string,
  senders: {
    data: Array<{
      name: string,
      email: string,
      id: string,
    }>
  },
  participants: {
    data: Array<{
      name: string,
      email: string,
      id: string,
    }>
  },
  updated_time: string
}
