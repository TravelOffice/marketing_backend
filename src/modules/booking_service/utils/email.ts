import { lambdaProvider } from 'core';
import { getEnv } from 'get-env';
import { MailTemplate } from '../models/MailTemplate';

/**
 * Send mail via notification service
 * @param fromAddress Send from
 * @param mailTemplate Mail Template include toAddress, ccAddresses, subject, html, text
 * @returns
 */
const sendEmail = async (fromAddress: string, mailTemplate: MailTemplate) => {
  const sendMailData = {
    type: 'EMAIL',
    data: {
      fromAddress,
      ...mailTemplate,
    },
  };
  await lambdaProvider.invokeFunction({
    FunctionName: getEnv('SEND_NOTIFICATION_SERVICE_NAME'),
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: Buffer.from(JSON.stringify(sendMailData)),
  });
};

export default sendEmail;
