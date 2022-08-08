import { DDBConversation } from 'common-models';
import { ConversationQueryParams } from '../../models/ConversationQueryParams';

export interface ChatRepository {
  getConversation: (
    conversationQueryParams: ConversationQueryParams,
  ) => Promise<DDBConversation | undefined>

  saveConversationWithNewAssignee: (
    conversation: DDBConversation,
    assignee: string,
  ) => Promise<void>
}
