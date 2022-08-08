import { ConversationQueryParams } from '../../models/ConversationQueryParams';
import { RestrictedConversation } from '../../models/RestrictedConversation';

export interface ManualAssignChatUseCase {
  invoke: (
    conversationQueryParams: ConversationQueryParams,
    assignee: string,
  ) => Promise<RestrictedConversation>
}
