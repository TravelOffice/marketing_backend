import { NotificationTypes } from './NotificationType';

export interface BasedNotificationEvent
  <
  TYPE extends NotificationTypes,
  DATA extends any,
  > {
  type: TYPE,
  data: DATA,
}
