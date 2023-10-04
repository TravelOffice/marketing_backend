import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { dynamoProvider } from 'core';
import { DdbModelChangeType } from './models/dataSubscription/DdbModelChangeType';
import logger from './utils/logger';

/* eslint-disable */

/**
 * Get model change type from DynamoDB record
 * @param record DynamoDB record
 * @returns Model change type
 */
function getModelChangeType(record: DynamoDBRecord): DdbModelChangeType | undefined {
  // Extract data from record
  const { dynamodb, eventName } = record;
  if (!dynamodb || !dynamodb.Keys) {
    return undefined;
  }
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk, sk } = marshalledKeys;

  logger.log(`Data change type ${eventName} with keys pk: ${pk}, sk: ${sk}`);

  return 'OTHER';
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    const { Records: records } = event;
    logger.log(`Start handling DynamoDB Stream event records ${JSON.stringify(records, null, 5)}`);

    if (!records || records.length === 0) {
      logger.log('No DynamoDB records to handle');
    }

    // Start handling DynamoDB records to update statistic data
    // There are two kinds of statistic data:
    // 1. Statistic data of the lead
    // 2. Statistic data of the booking
    // * Lambda handles maximum 100 (Batch size setup by Lambda trigger) records at a time
    // Number of records is large enough to reduce infrastructure cost and improve performance
  } catch (error) {
    logger.log(`Error occurred when handling DynamoDB Stream event ${error}`);
  }
};
