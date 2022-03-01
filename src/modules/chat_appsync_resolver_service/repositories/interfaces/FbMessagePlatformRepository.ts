import { Message, FacebookMessageResponsePayload } from '../../models';

export interface FbMessagePlatformRepository {
  sendMessage: (message: Message) => Promise<any>;
  getConversations: (pageId: string) => Promise<FacebookMessageResponsePayload | undefined>;
  getMessages: (senderAsPageId: string, conversationId: string, before?: string) => Promise<FacebookMessageResponsePayload | undefined>;
}
