import { BaseDdbModel, DDBConversation } from 'common-models';

// Type of sk is string
type TypeOfSk = BaseDdbModel['sk'];

// DDB Model without indexes
export type RestrictedDDBModel<T extends BaseDdbModel> = Omit<T, 'pk' | 'sk' | 'lsi1' | 'lsi2' | 'lsi3' | 'lsi4' | 'lsi5'>;

export interface RestrictedTelegramConversation extends RestrictedDDBModel<DDBConversation> {
  conversationId?: TypeOfSk,
}

export interface TelegramConversationWithAssignee extends DDBConversation {
  assignee?: string
}
