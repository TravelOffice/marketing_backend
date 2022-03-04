import { Message } from './Message';

type EventField = 'sendMessage' | 'receivedMessage' | 'allConversations' | 'allMessages';
type UnknownEventField<T> = T extends EventField ? never : T & EventField extends T ? never : T;

type SendMessageEvent = {
  field: 'sendMessage',
  arguments: Message
}

type ReceivedMessageEvent = {
  field: 'receivedMessage',
  arguments: Message
}
type AllConversationsEvent = {
  field: 'allConversations',
  arguments: {
    pageId: string
  }
}

type AllMessagesEvent = {
  field: 'allMessages',
  arguments: {
    pageId: string,
    conversationId: string,
    before?: string
  }
}

type UnknownEvent = {
  field: UnknownEventField<string>,
  arguments: any
}

export type AppSyncEvent = SendMessageEvent | ReceivedMessageEvent | AllConversationsEvent | AllMessagesEvent | UnknownEvent;
