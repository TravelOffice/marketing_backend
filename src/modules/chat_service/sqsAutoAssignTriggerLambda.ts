import { saleAssignmentRepository } from 'auto-assign-utilities';
import AWS from 'aws';
import { ConversationQueryParams } from './models/ConversationQueryParams';
import { SQSEvent, SQSHandler } from './models/types/lambda/sqs';
import { SFN_NAME_DELIMITER } from './utils/constants';
import logger from './utils/logger';

const stepfunctions = new AWS.StepFunctions();

// eslint-disable-next-line import/prefer-default-export
export const handler: SQSHandler = async (event: SQSEvent) => {
  // SQS records data
  const { Records: records } = event;
  logger.log(`[sqsAutoAssignTriggerLambda] Received AWS SQS records ${records}`);

  // Handle SQS records
  const promises = records.map(async (record) => {
    let conversation;
    try {
      conversation = JSON.parse(record.body) as ConversationQueryParams;
      const { chatPlatform, pageId, conversationId } = conversation;
      const data = await stepfunctions.startExecution({
        stateMachineArn: process.env.AUTO_ASSIGN_SFN_ARN as string,
        name: `${chatPlatform}${SFN_NAME_DELIMITER}${pageId}${SFN_NAME_DELIMITER}${conversationId}`,
        input: record.body,
      }).promise();

      logger.log(`[sqsAutoAssignTriggerLambda] Started AWS StepFunctions with information ${JSON.stringify(data, null, 2)}`);
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
