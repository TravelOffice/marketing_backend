export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  APPSYNC = 'APPSYNC',
}

export type NotificationTypes = keyof typeof NotificationType;
