import {
  DDBConversation,
  RestrictedDDBModel,
  TypeOfSk,
} from 'common-models';

export interface RestrictedZaloConversation extends RestrictedDDBModel<DDBConversation> {
  conversationId?: TypeOfSk,
}

export interface ZaloConversationWithAssignee extends DDBConversation {
  assignee?: string
}
