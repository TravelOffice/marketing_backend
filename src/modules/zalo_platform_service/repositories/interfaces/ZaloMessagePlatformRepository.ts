import {
  SendMessageMutationArgs,
  ZaloMessageResponsePayload,
} from '../../models';

export interface ZaloMessagePlatformRepository {
  sendMessage: (message: SendMessageMutationArgs) => Promise<any>;
  getConversations: (
    pageId: string,
    offset?: number,
    count?: number,
  ) => Promise<ZaloMessageResponsePayload | undefined>;
  getMessages: (
    pageId: string,
    userId: string,
    offset?: number,
    count?: number,
  ) => Promise<ZaloMessageResponsePayload | undefined>;
}
