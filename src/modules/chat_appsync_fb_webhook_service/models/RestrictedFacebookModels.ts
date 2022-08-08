import {
  DDBConversation,
  RestrictedDDBModel,
  TypeOfSk,
} from 'common-models';

export interface RestrictedFacebookConversation extends RestrictedDDBModel<DDBConversation> {
  conversationId?: TypeOfSk,
}

export interface FacebookConversationWithAssignee extends RestrictedFacebookConversation {
  assignee?: string
}
