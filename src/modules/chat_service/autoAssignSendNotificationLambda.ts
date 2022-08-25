import { saleAssignmentRepository } from 'auto-assign-utilities';
import AWS from 'aws';
import { getEnv } from 'get-env';
import { ConversationQueryParams } from './models/ConversationQueryParams';
import { DDBUser } from './models/dynamodb/DDBUser';
import { MailTemplate } from './models/MailTemplates';
import { tenantRepository } from './repositories';
import { NO_REPLY_DEFAULT_EMAIL } from './utils/constants';
import logger from './utils/logger';
import formatString from './utils/string';

const lambda = new AWS.Lambda();

export enum ProcessResultCode {
  SUCCESS = 'AUTO_ASSIGN_NEW_CHAT_SUCCESSFULLY',
  NO_AVAILABLE_SALE = 'AUTO_ASSIGN_NO_AVAILABLE_SALE',
  NOT_RESPONSE_CHAT = 'AUTO_ASSIGN_NOT_RESPONSE_NEW_CHAT',
  NO_ADMINS = 'AUTO_ASSIGN_NO_ADMINS',
}

export interface AutoAssignSendNotificationEvent {
  conversation: ConversationQueryParams,
  taskToken?: string,
  assignment: {
    assignedSale?: DDBUser,
    code: ProcessResultCode
  },
  admins: {
    emails: string[]
  },
}

/**
 * Send mail via notification service
 * @param fromAddress Send from
 * @param toAddresses Send mail to addresses
 * @param ccAddresses CC addresses
 * @param subject Mail subject
 * @param html Html mail content
 * @param text Text content for mail client which doesn't support html
 * @returns
 */
const sendEmail = async (fromAddress: string, mailTemplate: MailTemplate) => {
  const sendMailData = {
    type: 'MAIL',
    data: {
      fromAddress,
      ...mailTemplate,
    },
  };
  const invokeParams: AWS.Lambda.Types.InvocationRequest = {
    FunctionName: getEnv('SEND_NOTIFICATION_SERVICE_NAME'),
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(sendMailData),
  };
  const { Payload: payloadString } = await lambda.invoke(invokeParams).promise();
  if (payloadString && typeof payloadString === 'string') {
    return JSON.parse(payloadString);
  }
  throw new Error('Unable to read payload returned from invocation');
};

const onSuccess = async (
  conversation: ConversationQueryParams,
  assignedSale: DDBUser,
  taskToken: string,
) => {
  // Get mail template
  let mailTemplate = await tenantRepository.getMailTemplate(conversation.tenant, 'aancs');

  // Format template and send mail with formatted template
  const params = {
    tenant: conversation.tenant,
    chatPlatform: conversation.chatPlatform,
    saleName: `[${assignedSale.username}] ${assignedSale.firstName} ${assignedSale.lastName}`,
  };
  mailTemplate = {
    ...mailTemplate,
    html: formatString(mailTemplate.html, params),
    text: formatString(mailTemplate.text, params),
  };
  await sendEmail(NO_REPLY_DEFAULT_EMAIL, mailTemplate);
  logger.log(`An email notification has been sent with template ${mailTemplate}`);

  // Store task token. Task token will be used to send to StepFunctions later
  await saleAssignmentRepository.storeSfnTaskToken(
    conversation.tenant,
    conversation.chatPlatform,
    conversation.pageId,
    conversation.conversationId,
    taskToken,
  );
  logger.log(`Task token has been stored ${taskToken}`);
};

const onFailedWithNoSaleAvailable = async (conversation: ConversationQueryParams) => {
  // Get mail template
  let mailTemplate = await tenantRepository.getMailTemplate(conversation.tenant, 'aanas');
  // Format template and send mail with formatted template
  const params = {
    tenant: conversation.tenant,
    chatPlatform: conversation.chatPlatform,
  };
  mailTemplate = {
    // Send mail with success content
    ...mailTemplate,
    html: formatString(mailTemplate.html, params),
    text: formatString(mailTemplate.text, params),
  };
  await sendEmail(NO_REPLY_DEFAULT_EMAIL, mailTemplate);
  logger.log(`An email notification has been sent with template ${mailTemplate}`);
};

const onFailedWithNotResponseChat = async (
  conversation: ConversationQueryParams,
  assignedSale: DDBUser,
) => {
  // Get mail template
  let mailTemplate = await tenantRepository.getMailTemplate(conversation.tenant, 'aanrnc');
  // Format template and send mail with formatted template
  const params = {
    tenant: conversation.tenant,
    chatPlatform: conversation.chatPlatform,
    saleName: `[${assignedSale.username}] ${assignedSale.firstName} ${assignedSale.lastName}`,
  };
  mailTemplate = {
    ...mailTemplate,
    html: formatString(mailTemplate.html, params),
    text: formatString(mailTemplate.text, params),
  };
  await sendEmail(NO_REPLY_DEFAULT_EMAIL, mailTemplate);
  logger.log(`An email notification has been sent with template ${mailTemplate}`);
};

export const handler = async (event: AutoAssignSendNotificationEvent) => {
  logger.log(`Received event from AWS StepFunctions, payload ${JSON.stringify(event, null, 3)}`);
  try {
    const { assignment, taskToken, conversation } = event;
    const { code, assignedSale } = assignment;

    switch (code) {
      case ProcessResultCode.SUCCESS: {
        if (taskToken && assignedSale) {
          onSuccess(conversation, assignedSale, taskToken);
        } else {
          throw new Error(`Parameters are incorrect, taskToken ${taskToken} assignedSale ${JSON.stringify(assignedSale, null, 2)}`);
        }

        break;
      }

      case ProcessResultCode.NO_AVAILABLE_SALE:
        onFailedWithNoSaleAvailable(conversation);
        break;

      case ProcessResultCode.NOT_RESPONSE_CHAT: {
        if (assignedSale) {
          onFailedWithNotResponseChat(conversation, assignedSale);
        } else {
          throw new Error(`Parameters are incorrect, assignedSale ${JSON.stringify(assignedSale, null, 2)}`);
        }

        break;
      }

      case ProcessResultCode.NO_ADMINS: {
        logger.log(`Does not have admins to continue auto assign process for conversation ${JSON.stringify(conversation, null, 2)}`);
        break;
      }

      default:
        throw new Error(`Result code ${code} is not supported yet.`);
    }
  } catch (error: any) {
    logger.log(`Generated an error: ${error.message}`);
  }
};
