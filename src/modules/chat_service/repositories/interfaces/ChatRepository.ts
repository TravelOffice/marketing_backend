import { NewConversationInfo } from 'auto-assign-utilities/models';
import { DDBConversation } from 'common-models';
import { ConversationQueryParams } from '../../models/ConversationQueryParams';

export interface ChatRepository {
  getConversation: (
    conversationQueryParams: ConversationQueryParams,
  ) => Promise<DDBConversation | undefined>

  getUnassignedConversation: (
    tenant: string,
  ) => Promise<Array<NewConversationInfo>>

  getListTenantHasUnassignedConversations: () => Promise<Array<string>>

  saveConversationWithNewAssignee: (
    conversation: DDBConversation,
    assignee: string,
  ) => Promise<void>
}
