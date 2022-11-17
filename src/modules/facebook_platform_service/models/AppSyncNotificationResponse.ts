export interface AppSyncNotificationResponse<T extends any = any> {
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
