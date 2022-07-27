import { FacebookMessageResponsePayload, FacebookUserProfile, Message } from '../../models';

export interface FbMessagePlatformRepository {
  sendMessage: (message: Message) => Promise<any>;
  getConversations: (
    tenantId: string,
    pageId: string,
    assigneeId?: string,
  ) => Promise<FacebookMessageResponsePayload | undefined>;
  getMessages: (
    senderAsPageId: string,
    conversationId: string,
    after?: string,
    limit?: number
  ) => Promise<FacebookMessageResponsePayload | undefined>;
  getUserProfile: (pageId: string, userId: string) => Promise<FacebookUserProfile | undefined>;
}
