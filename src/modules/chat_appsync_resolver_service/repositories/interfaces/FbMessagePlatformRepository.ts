import {
  FacebookMessageResponsePayload,
  FacebookUserProfile,
  SendMessageMutationArgs,
} from '../../models';

export interface FbMessagePlatformRepository {
  sendMessage: (message: SendMessageMutationArgs) => Promise<any>;
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
