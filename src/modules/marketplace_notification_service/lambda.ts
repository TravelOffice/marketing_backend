import { SQSEvent, SQSHandler } from './models/types/lambda/sqs';
import logger from './utils/logger';

// eslint-disable-next-line import/prefer-default-export
export const handler: SQSHandler = async (event: SQSEvent) => {
  // SQS records data
  const { Records: records } = event;
  logger.log(`[sqsAutoAssignTriggerLambda] Received AWS SQS records ${records}`);
};
