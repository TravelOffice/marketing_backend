import { ChatPlatform } from 'common-models';

export interface ConversationQueryParams {
  tenant: string,
  chatPlatform: ChatPlatform,
  pageId: string,
  conversationId: string,
  lastMessageSentAt?: string,
}
