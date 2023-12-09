import { SendEmailCommandInput } from '@aws-sdk/client-ses';
import { appSyncProvider, mailProvider } from '../providers';
import { MAIL_DEFAULT_CHARSET } from '../utils/constants';
import { NotificationRepository } from './interfaces/NotificationRepository';

export default class NotificationRepositoryImpl implements NotificationRepository {
  sendEmail = async (
    fromAddress: string,
    toAddresses: string[],
    ccAddresses: string[],
    html: string,
    text: string,
    subject: string,
  ) => {
    const request: SendEmailCommandInput = {
      Source: fromAddress,
      Destination: {
        ToAddresses: toAddresses,
        CcAddresses: ccAddresses,
      },
      Message: {
        Subject: {
          Charset: MAIL_DEFAULT_CHARSET,
          Data: subject,
        },
        Body: {
          Html: {
            Charset: MAIL_DEFAULT_CHARSET,
            Data: html,
          },
          Text: {
            Charset: MAIL_DEFAULT_CHARSET,
            Data: text,
          },
        },
      },
    };
    return mailProvider.sendMail(request);
  };

  sendAppSyncNotification = async (
    notificationType: string,
    data: string, // AWS JSON string
    timestamp: number,
    tenant?: string,
    username?: string,
  ) => appSyncProvider.executeSendNotification(notificationType, data, timestamp, tenant, username);
}
