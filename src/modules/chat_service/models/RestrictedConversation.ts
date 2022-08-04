import {
  ChatPlatform,
  DDBConversation,
  RestrictedDDBModel,
  TypeOfSk,
} from 'common-models';

export interface RestrictedConversation extends RestrictedDDBModel<DDBConversation> {
  chatPlatform?: ChatPlatform,
  pageId?: string,
  conversationId?: TypeOfSk,
  assignee?: string,
}
