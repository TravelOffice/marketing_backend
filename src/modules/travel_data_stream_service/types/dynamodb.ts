import { _Record, StreamRecord } from '@aws-sdk/client-dynamodb-streams';

export type RequiredStreamrecord = Required<StreamRecord>;

export interface OverridedDynamoDBRecord extends _Record {
  dynamodb: RequiredStreamrecord;
}

export type RequiredDynamoDBRecord = Required<OverridedDynamoDBRecord>;
