import { RequiredDynamoDBRecord } from '../types/dynamodb';

/**
 * Count changed entities
 * Entity can be LEAD or BOOKING
 * count = number of added entities - number of removed entities
 *
 * @param records DynamoDB records to count
 * @returns Number of changed entities
 */
export function countChangedEntities(records: RequiredDynamoDBRecord[]) {
  const added = records.filter(
    (record) => record.eventName === 'INSERT',
  ).length;
  const removed = records.filter(
    (record) => record.eventName === 'REMOVE',
  ).length;
  return added - removed;
}
