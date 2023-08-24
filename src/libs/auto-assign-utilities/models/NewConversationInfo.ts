import { ChatPlatform } from 'common-models';

export interface NewConversationInfo {
  tenant: string,
  pageId: string,
  chatPlatform: ChatPlatform,
  conversationId: string,
  pk: string,
  sk: string,
}
