/* eslint-disable */
import { DynamoDBStreamEvent } from 'aws-lambda';

export const ddbStreamEvent: DynamoDBStreamEvent = {
  Records: [
    {
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '1',
        Keys: {
          pk: {
            S: 'TENANT#pys#LEAD',
          },
          sk: {
            S: '',
          },
        },
        NewImage: {
        },
      },
    },
    {
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'MODIFY',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '2',
        Keys: {
          pk: {
            S: 'TENANT#pys#LEAD',
          },
          sk: {
            S: '',
          },
        },
        NewImage: {
        },
      },
    },
    {
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'MODIFY',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '3',
        Keys: {
          pk: {
            S: 'TENANT#pys#LEAD',
          },
          sk: {
            S: '',
          },
        },
        NewImage: {
        },
      },
    },
    {
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '4',
        Keys: {
          pk: {
            S: 'TENANT#pys#BOOKING',
          },
          sk: {
            S: '',
          },
        },
        NewImage: {
        },
      },
    },
  ],
};
