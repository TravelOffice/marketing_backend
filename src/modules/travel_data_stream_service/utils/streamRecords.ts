import { DynamoDBRecord } from 'aws-lambda';
import { dynamoProvider, logger } from 'core';
import { DdbModelChangeType } from '../models/dataSubscription/DdbModelChangeType';
import { isBooking, isLead } from './dynamodb';
import { RequiredDynamoDBRecord } from '../types/dynamodb';

/**
 * Get model change type from DynamoDB record
 *
 * @param record DynamoDB record
 * @returns Model change type
 */
export function getModelChangeType(record: DynamoDBRecord): DdbModelChangeType | undefined {
  // Extract data from record
  const { dynamodb, eventName } = record;
  if (!dynamodb || !dynamodb.Keys) {
    return undefined;
  }
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk, sk } = marshalledKeys;

  logger.log(`Data change type ${eventName} with keys pk: ${pk}, sk: ${sk}`);

  if (isLead(pk)) {
    return 'LEAD';
  } if (isBooking(pk)) {
    return 'BOOKING';
  }

  return 'OTHER';
}

/**
 * Extract tenant from DynamoDB record
 *
 * @param record
 * @returns
 */
export function getTenant(record: RequiredDynamoDBRecord): string | undefined {
  // Extract data from record
  const { dynamodb } = record;
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk } = marshalledKeys;
  return pk.split('#')[1];
}

/**
 * Convert DynamoDB record to pk#sk string
 *
 * @param record DynamoDB record to convert
 * @returns pk#sk string
 */
export function toPkSk(record: RequiredDynamoDBRecord): string {
  const { dynamodb } = record;
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk, sk } = marshalledKeys;
  return `${pk}#${sk}`;
}

/**
 * Convert DynamoDB record to unique pk#sk#eventName string
 *
 * @param record DynamoDB record to convert
 * @returns pk#sk#eventName string
 */
export function toUniquePkSkEventName(record: RequiredDynamoDBRecord): string {
  const { dynamodb, eventName } = record;
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk, sk } = marshalledKeys;
  return `${pk}#${sk}#${eventName}`;
}

export function isNeededHandleRecord(record: DynamoDBRecord): boolean {
  const { dynamodb } = record;
  const modelChangeType = getModelChangeType(record);
  return !dynamodb || !dynamodb.Keys || modelChangeType === 'OTHER';
}
