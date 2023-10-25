import { dynamoProvider } from 'core';
import { _Record } from '@aws-sdk/client-dynamodb-streams';
import { DdbModelChangeType } from '../models/dataSubscription/DdbModelChangeType';
import { isBooking, isDepartureTour, isLead } from './dynamodb';
import { RequiredDynamoDBRecord } from '../types/dynamodb';
import AbstractMetricAnalyzer from '../analyzer/metrics/AbstractMetricAnalyzer';
import MetricAnalyzerBuilder from '../analyzer/metrics/MetricAnalyzerBuilder';

/**
 * Get model change type from DynamoDB record
 *
 * @param record DynamoDB record
 * @returns Model change type
 */
export function getModelChangeType(record: _Record): DdbModelChangeType | undefined {
  // Extract data from record
  const { dynamodb } = record;
  if (!dynamodb || !dynamodb.Keys) {
    return undefined;
  }
  const marshalledKeys = dynamoProvider.unmarshall(dynamodb.Keys);
  const { pk } = marshalledKeys;

  if (isLead(pk)) {
    return 'LEAD';
  }

  if (isBooking(pk)) {
    return 'BOOKING';
  }

  if (isDepartureTour(pk)) {
    return 'DEPARTURE_TOUR';
  }

  return 'OTHER';
}

export function getMetricAnalyzers(tenant: string, records: RequiredDynamoDBRecord[]) {
  const analyzers: AbstractMetricAnalyzer[] = [];
  records.forEach((record) => {
    const modelName = getModelChangeType(record)!;
    if (modelName === 'BOOKING') {
      analyzers.push(MetricAnalyzerBuilder.build('BOOKING_METRIC', tenant, record));
    } else if (modelName === 'LEAD') {
      analyzers.push(MetricAnalyzerBuilder.build('LEAD_METRIC', tenant, record));
    } else if (modelName === 'DEPARTURE_TOUR') {
      // Metric for analyzing departure tour revenue, cost, profit
      analyzers.push(MetricAnalyzerBuilder.build('TOUR_METRIC', tenant, record));
      // Metric for analyzing departure tour filling ratio
      analyzers.push(MetricAnalyzerBuilder.build('TOUR_FILLINGRATIO_METRIC', tenant, record));
    }
  });
  return analyzers;
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

export function isNeededHandleRecord(record: _Record): boolean {
  const { dynamodb } = record;
  if (!dynamodb || !dynamodb.Keys) {
    return false;
  }
  const modelChangeType = getModelChangeType(record);
  return dynamodb && dynamodb.Keys && modelChangeType !== 'OTHER';
}
