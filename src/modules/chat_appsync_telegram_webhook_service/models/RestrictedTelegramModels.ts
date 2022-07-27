import { BaseDdbModel, DDBConversation } from 'common-models';

// Type of sk is string
type TypeOfSk = BaseDdbModel['sk'];

// DDB Model without indexes
export type RestrictedDDBModel<T extends BaseDdbModel> = Omit<T, 'pk' | 'sk' | 'typeLsi'>;

export interface RestrictedTelegramConversation extends RestrictedDDBModel<DDBConversation> {
  conversationId?: TypeOfSk,
}

export interface TelegramConversationWithAssignee extends RestrictedTelegramConversation {
  assignee?: string
}
