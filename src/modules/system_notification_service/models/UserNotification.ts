import { BaseDdbModel } from 'common-models';

export interface UserNotification extends BaseDdbModel {
  id: string,
  model: string,
  notification: {
    title: string,
    body: string,
  },
  code: string,
  action: string,
  read: boolean,
}

export type CreateUserNotificationDto = Pick<UserNotification,
  'model' |
  'notification' |
  'code' |
  'action'
>
