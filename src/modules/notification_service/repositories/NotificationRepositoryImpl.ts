import { mailProvider, SESSendEmailRequest } from '../providers';
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
    const request: SESSendEmailRequest = {
      FromEmailAddress: fromAddress,
      Destination: {
        ToAddresses: toAddresses,
        CcAddresses: ccAddresses,
      },
      Content: {
        Simple: {
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
      },
    };
    return mailProvider.sendMail(request);
  };
}
