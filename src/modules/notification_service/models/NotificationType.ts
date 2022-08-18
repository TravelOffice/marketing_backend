export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export type NotificationTypes = keyof typeof NotificationType;
