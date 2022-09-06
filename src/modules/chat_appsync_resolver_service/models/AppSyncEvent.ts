import { ChatPlatform } from 'common-models';
import { ReceiveMessageMutationArgs, SendMessageMutationArgs } from './Message';

type EventField = 'sendMessage' | 'receivedMessage' | 'allFbConversations' | 'allFbMessages' | 'allZaloConversations' | 'allZaloMessages';
type UnknownEventField<T> = T extends EventField ? never : T & EventField extends T ? never : T;

type SendMessageEvent = {
  field: 'sendMessage',
  arguments: SendMessageMutationArgs
}

type ReceivedMessageEvent = {
  field: 'receivedMessage',
  arguments: ReceiveMessageMutationArgs
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

// Telegram event
type AllTelegramConversationsEvent = {
  field: 'allTelegramConversations',
  arguments: {
    pageId: string,
  }
}

type AllTelegramMessageEvent = {
  field: 'allTelegramMessages',
  arguments: {
    pageId: string,
    conversationId: string,
    nextToken: string,
    limit: number
  }
}

type AdminAllTelegramConversationsEvent = {
  field: 'adminAllTelegramConversations',
  arguments: {
    pageId: string
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

export type NotificationData = any;

export type SendNotificationEvent<T extends any = any> = {
  field: 'sendNotification',
  arguments: {
    tenant?: string,
    // Username identifier to filter subscription
    username?: string,
    // Notification type
    type: string,
    // Timestamp
    timestamp: number,
    // Notification data
    data: T,
  }
}

// eslint-disable-next-line max-len
export type AppSyncEvent = (
  SendMessageEvent
  | ReceivedMessageEvent
  | AllFbConversationsEvent
  | AllFbMessagesEvent
  | AdminAllFbConversationsEvent
  | AllZaloConversationsEvent
  | AllZaloMessageEvent
  | AdminAllZaloConversationsEvent
  | AllTelegramConversationsEvent
  | AllTelegramMessageEvent
  | AdminAllTelegramConversationsEvent
  | UserProfileEvent
  | UnknownEvent
  | SendNotificationEvent<NotificationData>
) & { tenant: string, username: string };
