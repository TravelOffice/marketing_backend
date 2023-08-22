/* eslint-disable */
import { DynamoDBStreamEvent } from 'aws-lambda';

export const ddbStreamEvent: DynamoDBStreamEvent = {
  Records: [
    // {
    //   eventID: 'f98fab80db2c9bfd5c509e6738175501',
    //   eventName: 'MODIFY',
    //   eventVersion: '1.1',
    //   eventSource: 'aws:dynamodb',
    //   awsRegion: 'ap-southeast-1',
    //   dynamodb: {
    //     ApproximateCreationDateTime: 1692348489,
    //     Keys: {
    //       sk: {
    //         S: '1',
    //       },
    //       pk: {
    //         S: 'OF',
    //       },
    //     },
    //     OldImage: {
    //       offerStatus: {
    //         S: 'IN_PROCESS',
    //       },
    //       organization: {
    //         S: 'pys',
    //       },
    //     },
    //     NewImage: {
    //       offerStatus: {
    //         S: 'ACCEPTED',
    //       },
    //       organization: {
    //         S: 'pys',
    //       },
    //     },
    //   },
    // },
    // {
    //   eventID: 'f98fab80db2c9bfd5c509e6738175501',
    //   eventName: 'MODIFY',
    //   eventVersion: '1.1',
    //   eventSource: 'aws:dynamodb',
    //   awsRegion: 'ap-southeast-1',
    //   dynamodb: {
    //     ApproximateCreationDateTime: 1692348489,
    //     Keys: {
    //       sk: {
    //         S: '2',
    //       },
    //       pk: {
    //         S: 'OF',
    //       },
    //     },
    //     OldImage: {
    //       offerStatus: {
    //         S: 'IN_PROCESS',
    //       },
    //       organization: {
    //         S: 'pys',
    //       },
    //     },
    //     NewImage: {
    //       offerStatus: {
    //         S: 'ACCEPTED',
    //       },
    //       organization: {
    //         S: 'pys',
    //       },
    //     },
    //   },
    // },
    {
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        Keys: {
          sk: {
            S: '4',
          },
          pk: {
            S: 'OF',
          },
        },
        NewImage: {
          offerStatus: {
            S: 'IN_PROCESS',
          },
          organization: {
            S: 'pys',
          },
          tourPostId: {
            S: 'TP1',
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
        ApproximateCreationDateTime: 1692348489,
        Keys: {
          sk: {
            S: '5',
          },
          pk: {
            S: 'OF',
          },
        },
        NewImage: {
          offerStatus: {
            S: 'IN_PROCESS',
          },
          organization: {
            S: 'pys',
          },
          tourPostId: {
            S: 'TP1',
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
        ApproximateCreationDateTime: 1692348489,
        Keys: {
          sk: {
            S: 'TP1#1',
          },
          pk: {
            S: 'ORG#pys#R',
          },
        },
        NewImage: {
          organization: {
            S: 'pys',
          },
          tourPostId: {
            S: 'TP1',
          },
          star: {
            N: "5",
          },
        },
      },
    },
  ],
};
