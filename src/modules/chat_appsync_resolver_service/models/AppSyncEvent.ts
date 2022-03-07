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
  arguments: {
    pageId: string
  }
}

type AllFbMessagesEvent = {
  field: 'allFbMessages',
  arguments: {
    pageId: string,
    conversationId: string,
    before?: string
  }
}

// Zalo event
type AllZaloConversationsEvent = {
  field: 'allZaloConversations',
  arguments: {

  }
}

type AllZaloMessageEvent = {
  field: 'allZaloMessages',
  arguments: {
    conversationId: string,
    offset: number,
    limit?: number
  }
}

type UnknownEvent = {
  field: UnknownEventField<string>,
  arguments: any
}

export type AppSyncEvent = SendMessageEvent | ReceivedMessageEvent | AllFbConversationsEvent | AllFbMessagesEvent | AllZaloConversationsEvent | AllZaloMessageEvent | UnknownEvent;
