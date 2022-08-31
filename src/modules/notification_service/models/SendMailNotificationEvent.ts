import { BasedNotificationEvent } from './BasedNotificationEvent';

export interface SendNotificationMailData {
  fromAddress: string,
  toAddresses: string[],
  ccAddresses: string[],
  subject: string,
  html: string,
  text: string,
}

export type SendMailNotificationEvent = BasedNotificationEvent<'EMAIL', SendNotificationMailData>;
