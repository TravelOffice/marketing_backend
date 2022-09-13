import {
  DDBConversation, DDBMessage, BaseDdbModel, DDBFile, TelegramChat, TelegramUser,
} from 'common-models';

// Type of sk is string
type TypeOfSk = BaseDdbModel['sk'];

// DDB Model without indexes
export type RestrictedDDBModel<T extends BaseDdbModel> = Omit<T, 'pk' | 'sk' | 'typeLsi'>;

export interface RestrictedTelegramConversation extends RestrictedDDBModel<DDBConversation> {
  conversationId: TypeOfSk,
  assignee?: string,
}

export interface RestrictedTelegramMessage extends RestrictedDDBModel<DDBMessage> { }

export interface TelegramPagingMessage {
  nextToken?: string
  messages: Array<RestrictedTelegramMessage>,
}

export interface TelegramConversationWithAssignee extends RestrictedTelegramConversation {
  assignee: string
}

export interface TelegramFileInformation {
  file_id: string,
  file_path: string,
  file_size: number,
  file_unique_id: string,
}
export interface RestrictedTelegramFile extends RestrictedDDBModel<DDBFile> {
  fileInfo: TelegramFileInformation,
}

export interface UserWithAvatar extends TelegramUser {
  avatar?: TelegramFileInformation;
}

export interface GroupWithAvatar extends TelegramChat {
  avatar?: TelegramFileInformation;
}
