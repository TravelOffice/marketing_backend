import { BasedNotificationEvent } from './BasedNotificationEvent';

export interface SendNotificationAppSyncData {
  tenant?: string,
  // Username identifier to filter subscription
  username?: string,
  // Notification type
  type: string,
  // Timestamp
  timestamp: number,
  // Notification data
  data: any,
}

export type SendAppSyncNotificationEvent = BasedNotificationEvent<'APPSYNC', SendNotificationAppSyncData>;
