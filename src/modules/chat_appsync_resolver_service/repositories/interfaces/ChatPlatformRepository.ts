import { ChatPlatform } from 'common-models';

export interface ChatPlatformRepository {
  getConversationsAssignee: (
    tenantId: string,
    pageId: string,
    conversationId: string,
    chatPlatform: ChatPlatform,
  ) => Promise<string>
}
