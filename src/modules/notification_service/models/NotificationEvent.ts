import { SendAppSyncNotificationEvent } from './SendAppSyncNotificationEvent';
import { SendMailNotificationEvent } from './SendMailNotificationEvent';

export type NotificationEvent = SendMailNotificationEvent | SendAppSyncNotificationEvent;
