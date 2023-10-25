/* eslint-disable */
import {_Record} from "@aws-sdk/client-dynamodb-streams";

export const ddbStreamEvent: { Records: _Record[]; } = {
  Records: [
    {
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: new Date(1692348489),
        SequenceNumber: '1',
        Keys: {
          sk: {
            S: 'CONVERSATION#2497293378443431012',
          },
          pk: {
            S: 'TENANT#pys#CONVERSATION#ZALO#1529156583008172410',
          },
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
        ApproximateCreationDateTime: new Date(1692348489),
        SequenceNumber: '2',
        Keys: {
          sk: {
            S: 'CONVERSATION#t_1345272092655281',
          },
          pk: {
            S: 'TENANT#pys#CONVERSATION#FACEBOOK#100945222539258',
          },
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
        ApproximateCreationDateTime: new Date(1692348489),
        SequenceNumber: '3',
        Keys: {
          sk: {
            S: '2497293378443431012#1',
          },
          pk: {
            S: 'TENANT#pys#SESSION',
          },
        },
        OldImage: {
          // For REMOVE only
          assigneeId: {
            S: 'anhnt',
          },
        },
        NewImage: {
          startTime: {
            N: "1695801397738",
          },
          status: {
            S: 'CLOSED',
          },
          assigneeId: {
            S: 'anhnt',
          },
          responseTime: {
            N: '60',
          },
          duration: {
            N: '3600',
          },
        },
      },
    },
  ],
};
