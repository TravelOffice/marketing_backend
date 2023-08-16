/**
 * This lambda function aims to handle the event from AWS DynamoDB Stream Trigger
 * Following features that this lambda function will handle:
 * - Handle TourPost related event and update statistical data for market place
 * - Handle TourPost related event and update statistical data for each organization
 * - Handle TourPost related event and update statistical data for each sale user
 * - Send notification to user when their post has any new activity such as:
 * + New comment on post thread
 * + Has new user bookmarked or followed on it
 * + Data changed
 * + New offer
 * + Offer approved / rejected / changed and so on
 * + Post expired
 * + And so on
 */
import { DynamoDBStreamEvent } from 'aws-lambda';
import logger from './utils/logger';
import { onMarketplaceDataStreamed } from './useCases';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  logger.log('Start handling DynamoDB Stream event');
  const { Records: records } = event;
  records.forEach((record) => {
    logger.log(`DynamoDB Record: ${JSON.stringify(record, null, 3)}`);
  });
  await onMarketplaceDataStreamed.invoke(records);
};
