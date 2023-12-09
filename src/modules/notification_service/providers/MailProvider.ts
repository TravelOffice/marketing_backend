import { SendEmailCommand, SendEmailCommandInput, SESClient } from '@aws-sdk/client-ses';
import logger from '../utils/logger';

const client = new SESClient();

export default class MailProvider {
  /**
   * Send email via AWS SES
   * @param request Send email request
   */
  sendMail = async (request: SendEmailCommandInput) => {
    const command = new SendEmailCommand(request);
    const sendResponse = await client.send(command);
    logger.log(`Email has sent, response is ${JSON.stringify(sendResponse)}`);
    return sendResponse;
  };
}
