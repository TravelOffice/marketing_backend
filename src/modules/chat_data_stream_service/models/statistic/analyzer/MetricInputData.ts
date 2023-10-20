import { RequiredDynamoDBRecord } from '../../../types/dynamodb';

export type SingleMetricInputData = RequiredDynamoDBRecord;
export type MetricInputData = RequiredDynamoDBRecord | RequiredDynamoDBRecord[];
