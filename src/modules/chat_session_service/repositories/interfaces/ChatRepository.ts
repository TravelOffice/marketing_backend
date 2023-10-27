import { DDBConversation } from 'common-models';

export interface ChatRepository {
  getConversationByReverseIndex: (
    params: {
      tenant: string,
      chatPlatform: string,
      conversationId: string,
    }
  ) => Promise<DDBConversation | undefined>

  closeConversation: (conversation: DDBConversation) => Promise<void>
}
