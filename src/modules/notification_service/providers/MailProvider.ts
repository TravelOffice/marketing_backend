import AWS from 'aws';
import logger from '../utils/logger';

const ses = new AWS.SESV2();

export type SESSendEmailRequest = AWS.SESV2.Types.SendEmailRequest
export type SESSendEmailResponse = AWS.SESV2.Types.SendEmailResponse

export default class MailProvider {
  /**
   * Send email via AWS SES
   * Refer to https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property for detail
   * @param request Send email request
   */
  sendMail = async (request: SESSendEmailRequest) => {
    const sendResponse = await ses.sendEmail(request).promise();
    logger.log(`Email has sent, response is ${JSON.stringify(sendResponse)}`);
    return sendResponse;
  };
}
