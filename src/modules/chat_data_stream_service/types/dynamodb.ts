// import { DynamoDBRecord, StreamRecord } from 'aws-cognito';
import { _Record, StreamRecord } from '@aws-sdk/client-dynamodb-streams';

export type RequiredStreamRecord = Required<StreamRecord>;

export interface OverridedDynamoDBRecord extends _Record {
  dynamodb: RequiredStreamRecord;
}

export type RequiredDynamoDBRecord = Required<OverridedDynamoDBRecord>;
