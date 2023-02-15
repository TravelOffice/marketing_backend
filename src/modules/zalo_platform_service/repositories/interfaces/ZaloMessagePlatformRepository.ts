import {
  SendMessageMutationArgs,
  ZaloMessageResponsePayload,
} from '../../models';

export interface ZaloMessagePlatformRepository {
  sendMessage: (
    tenantId: string,
    message: SendMessageMutationArgs
  ) => Promise<any>;
  getConversations: (
    tenantId: string,
    pageId: string,
    assigneeId?: string,
  ) => Promise<ZaloMessageResponsePayload | undefined>;
  getConversationMessages: (
    tenantId: string,
    pageId: string,
    userId: string,
    nextToken?: string,
    limit?: number,
  ) => Promise<ZaloMessageResponsePayload | undefined>;
  getZaloAudio: (
    tenantId: string,
    pageId: string,
    conversationId: string,
    messageId: string,
    fileUrl: string,
  ) => Promise<ZaloMessageResponsePayload | undefined>;
}
