import { ChatPlatform } from 'common-models';
import { Message } from './Message';

type EventField = 'sendMessage' | 'receivedMessage' | 'allFbConversations' | 'allFbMessages' | 'allZaloConversations' | 'allZaloMessages';
type UnknownEventField<T> = T extends EventField ? never : T & EventField extends T ? never : T;

type SendMessageEvent = {
  field: 'sendMessage',
  arguments: Message
}

type ReceivedMessageEvent = {
  field: 'receivedMessage',
  arguments: Message
}

// Facebook event
type AllFbConversationsEvent = {
  field: 'allFbConversations',
  username: string,
  tenant: string,
  arguments: {
    pageId: string
  }
}

type AllFbMessagesEvent = {
  field: 'allFbMessages',
  arguments: {
    pageId: string,
    conversationId: string,
    after?: string,
    limit?: number
  }
}

type AdminAllFbConversationsEvent = {
  field: 'adminAllFbConversations',
  username: string,
  tenant: string,
  arguments: {
    pageId: string
  }
}

// Zalo event
type AllZaloConversationsEvent = {
  field: 'allZaloConversations',
  arguments: {
    pageId: string,
    offset?: number,
    count?: number
  }
}

type AllZaloMessageEvent = {
  field: 'allZaloMessages',
  arguments: {
    pageId: string,
    userId: string,
    offset: number,
    count?: number
  }
}

type AdminAllZaloConversationsEvent = {
  field: 'adminAllZaloConversations',
  arguments: {
    pageId: string,
    offset?: number,
    count?: number
  }
}

type UserProfileEvent = {
  field: 'userProfile',
  arguments: {
    platform: ChatPlatform,
    pageId: string,
    pageUserId: string,
    chatId?: string,
  }
}

export type UnknownEvent = {
  field: UnknownEventField<string>,
  arguments: any
}

// eslint-disable-next-line max-len
export type AppSyncEvent = SendMessageEvent | ReceivedMessageEvent | AllFbConversationsEvent | AllFbMessagesEvent | AdminAllFbConversationsEvent | AllZaloConversationsEvent | AllZaloMessageEvent | AdminAllZaloConversationsEvent | UserProfileEvent | UnknownEvent;
