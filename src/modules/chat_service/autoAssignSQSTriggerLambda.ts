import { saleAssignmentRepository } from 'auto-assign-utilities';
import { getAwsSecretValue, getEnv } from 'get-env';
import { ConversationQueryParams } from './models/ConversationQueryParams';
import { SQSEvent, SQSHandler } from './models/types/lambda/sqs';
import { SFN_NAME_DELIMITER } from './utils/constants';
import { CONVERSATION_INDEX, PAGE_INDEX, TASK_TOKEN_INDEX, TENANT_INDEX } from './utils/dynamodbConstants';
import logger from './utils/logger';

let sfnEnvironment: {
  dynamoTravelTable: string,
  dynamoChatTable: string,
  assignChatLambdaFn: string,
  notifyChatLambdaFn: string,
};

/**
 * Get environment information for auto assign StepFunctions workflows
 * Environment data can be reuse for the other Lambda invocations
 */
const getSfnEnv = async () => {
  if (!sfnEnvironment) {
    const dynamoTravelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const dynamoChatTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const assignChatLambdaFn = getEnv('ASSIGN_CHAT_LAMBDA_FUNCTION_ARN');
    const notifyChatLambdaFn = getEnv('NOTIFY_AUTO_ASSIGN_CHAT_RESULT_LAMBDA_FUNCTION_ARN');
    sfnEnvironment = {
      dynamoTravelTable,
      dynamoChatTable,
      assignChatLambdaFn,
      notifyChatLambdaFn,
    };
  }
};

// eslint-disable-next-line import/prefer-default-export
export const handler: SQSHandler = async (event: SQSEvent) => {
  // SQS records data
  const { Records: records } = event;
  logger.log(`[sqsAutoAssignTriggerLambda] Received AWS SQS records ${records}`);

  // Handle SQS records
  const promises = records.map(async (record) => {
    try {
      await getSfnEnv();
      const conversation = JSON.parse(record.body) as ConversationQueryParams;
      const {
        tenant, chatPlatform,
        pageId, conversationId,
      } = conversation;
      const sfnInput = {
        conversation: {
          ...conversation,
          pk: `${TENANT_INDEX}#${tenant}#${CONVERSATION_INDEX}#${chatPlatform.toUpperCase()}#${pageId}`,
          sk: `${CONVERSATION_INDEX}#${conversationId}`,
        },
        env: {
          ...sfnEnvironment,
          tenant: `${TENANT_INDEX}#${tenant}`,
          conversationTaskToken: {
            pk: `${TENANT_INDEX}#${tenant}#${PAGE_INDEX}#${chatPlatform.toUpperCase()}#${pageId}`,
            sk: `${TASK_TOKEN_INDEX}#${conversationId}`,
          },
        },
      };
      const executionId = `${chatPlatform}${SFN_NAME_DELIMITER}${pageId}${SFN_NAME_DELIMITER}${conversationId}${SFN_NAME_DELIMITER}${Date.now()}`;
      await saleAssignmentRepository.startSaleAssignmentSfnWorkflow(
        process.env.AUTO_ASSIGN_SFN_ARN as string,
        executionId,
        JSON.stringify(sfnInput),
      );
    } catch (error: any) {
      logger.log(`[sqsAutoAssignTriggerLambda] Error occurred ${error}`);
    } finally {
      // Delete message from queueExecuteStepFunction
      await saleAssignmentRepository.onSaleAssignmentAutoProcessStarted(record.receiptHandle);
      logger.log(`[sqsAutoAssignTriggerLambda] Deleted queue message ${record.receiptHandle}`);
    }
  });
  await Promise.all(promises);
};
