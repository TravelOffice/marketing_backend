import { SendEmailCommandOutput } from '@aws-sdk/client-ses';

export interface NotificationRepository {
  sendEmail: (
    fromAddress: string,
    toAddresses: string[],
    ccAddresses: string[],
    html: string,
    text: string,
    subject: string,
  ) => Promise<SendEmailCommandOutput>
  sendAppSyncNotification: (
    notificationRype: string,
    data: string,
    timestamp: number,
    tenant?: string,
    username?: string,
  ) => Promise<any>
}
