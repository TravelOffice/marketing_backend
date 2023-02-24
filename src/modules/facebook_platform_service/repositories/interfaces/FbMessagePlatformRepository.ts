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
  getConversationMessages: (
    tenantId: string,
    pageId: string,
    conversationId: string,
    nextToken?: string,
    limit?: number,
  ) => Promise<FacebookMessageResponsePayload | undefined>;
  getUserProfile: (pageId: string, userId: string) => Promise<FacebookUserProfile | undefined>;
}
