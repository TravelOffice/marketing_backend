/* eslint-disable */
import { DynamoDBStreamEvent } from 'aws-lambda';

export const ddbStreamEvent: DynamoDBStreamEvent = {
  Records: [
    // LEAD changes
    {
      // Inserted LEAD data with code = 1, tenant = pys
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
            S: '1',
          },
        },
        NewImage: {
          createdAt: {
            N: "1695801397738",
          },
          locationId: {
            S: '1',
          },
          locationName: {
            S: 'HCM',
          },
          assigneeId: {
            S: 'anlt',
          },
          code: {
            S: '1',
          },
        },
      },
    },
    {
      // Inserted LEAD data with code = 2, tenant = pys
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'INSERT',
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
            S: '2',
          },
        },
        NewImage: {
          createdAt: {
            N: "1695801397738",
          },
          locationId: {
            S: '2',
          },
          locationName: {
            S: 'HN',
          },
          assigneeId: {
            S: 'anhnt',
          },
          code: {
            S: '2',
          },
        },
      },
    },
    {
      // Modified LEAD data with code = 1, tenant = pys but event name is not INSERT
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
            S: '1',
          },
        },
        NewImage: {
          createdAt: {
            N: "1695801397738",
          },
          locationId: {
            S: '1',
          },
          locationName: {
            S: 'HCM',
          },
          assigneeId: {
            S: 'anlt',
          },
          code: {
            S: '1',
          },
        },
      },
    },
    {
      // Inserted LEAD data with code = 1, tenant = aca
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
            S: 'TENANT#aca#LEAD',
          },
          sk: {
            S: '1',
          },
        },
        NewImage: {
          createdAt: {
            N: "1695801397738",
          },
          locationId: {
            S: '2',
          },
          locationName: {
            S: 'Malaysia',
          },
          assigneeId: {
            S: 'anlt',
          },
          code: {
            S: '1',
          },
        },
      },
    },
    // BOOKING changes
    {
      // Inserted BOOKING data with code = 1, tenant = pys
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '5',
        Keys: {
          pk: {
            S: 'TENANT#pys#BOOKING',
          },
          sk: {
            S: '1',
          },
        },
        NewImage: {
          createdAt: {
            N: "1695801397738",
          },
          tourTemplateId: {
            S: '1',
          },
          tourTemplateName: {
            S: 'Tour di HCM',
          },
          assigneeId: {
            S: 'quylv',
          },
          code: {
            S: '1',
          },
          totalPayment: {
            N: '10000000',
          },
        },
      },
    },
    // DEPARTURE_TOUR changes
    {
      // Modified DEPARTURE_TOUR
      // with status changed from WAITING_FOR_OPERATION to COMPLETED
      // and fillingRatio change from 5 to 50
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'MODIFY',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '6',
        Keys: {
          pk: {
            S: 'TENANT#pys#DEPARTURE_TOUR',
          },
          sk: {
            S: '1',
          },
        },
        OldImage: {
          operationStatus: {
            S: 'WAITING_FOR_OPERATION',
          },
          fillingRatio: {
            N: '5',
          },
        },
        NewImage: {
          operationStatus: {
            S: 'COMPLETED',
          },
          createdAt: {
            N: "1695801397738",
          },
          totalRevenue: {
            N: '55000000',
          },
          totalCost: {
            N: '40000000',
          },
          totalProfit: {
            N: '15000000',
          },
          assigneeId: {
            S: 'quylv',
          },
          code: {
            S: '1',
          },
          name: {
            S: 'Tour KH di HCM thang 10/2023',
          },
          fillingRatio: {
            N: '50',
          },
        },
      },
    },
    {
      // Modified DEPARTURE_TOUR and status is not changed
      // Do not need to store statistic data
      eventID: 'f98fab80db2c9bfd5c509e6738175501',
      eventName: 'MODIFY',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'ap-southeast-1',
      dynamodb: {
        ApproximateCreationDateTime: 1692348489,
        SequenceNumber: '7',
        Keys: {
          pk: {
            S: 'TENANT#pys#DEPARTURE_TOUR',
          },
          sk: {
            S: '2',
          },
        },
        OldImage: {
          operationStatus: {
            S: 'COMPLETED',
          },
        },
        NewImage: {
          operationStatus: {
            S: 'COMPLETED',
          },
          createdAt: {
            N: "1695801397738",
          },
          totalRevenue: {
            N: '55000000',
          },
          totalCost: {
            N: '40000000',
          },
          totalProfit: {
            N: '15000000',
          },
          assigneeId: {
            S: 'quylv',
          },
          code: {
            S: '1',
          },
          name: {
            S: 'Tour KH di HCM thang 10/2023',
          },
        },
      },
    },
  ],
};
