import { DynamoDBRecord, StreamRecord } from 'aws-lambda';

export type RequiredStreamrecord = Required<StreamRecord>;
export interface OverridedDynamoDBRecord extends DynamoDBRecord {
  dynamodb: RequiredStreamrecord;
}
export type RequiredDynamoDBRecord = Required<OverridedDynamoDBRecord>;
