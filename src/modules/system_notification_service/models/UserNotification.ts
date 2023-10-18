import { BaseDdbModel } from 'common-models';

export enum UserNotificationType {
  POST = 'POST',
  OFFER = 'OFFER',
  COMMENT = 'COMMENT',
}

export interface UserNotification extends BaseDdbModel {
  notification: {
    title: string,
    body: string,
  },
  data: {
    id?: string,
    href: string,
    type: UserNotificationType,
    read: 'read' | 'unread',
  }
}

export type CreateUserNotificationDto = Pick<UserNotification,
  'notification' |
  'data'
>
