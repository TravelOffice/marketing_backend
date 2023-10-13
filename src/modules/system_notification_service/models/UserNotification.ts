import { BaseDdbModel } from 'common-models';

export enum UserNotificationType {
  POST = 'POST',
  OFFER = 'OFFER',
  COMMENT = 'COMMENT',
}

export interface UserNotification extends BaseDdbModel {
  id: string,
  title: string,
  body: string,
  href: string,
  type: UserNotificationType,
  read: 'read' | 'unread',
}

export type CreateUserNotificationDto = Pick<UserNotification,
  'href' |
  'title' |
  'body' |
  'type'
>
