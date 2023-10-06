import { DynamoDBStreamEvent } from 'aws-lambda';
import * as _ from 'lodash';
import { RequiredDynamoDBRecord } from './types/dynamodb';
import logger from './utils/logger';
import {
  getTenant,
  isNeededHandleRecord,
  toPkSk,
  toUniquePkSkEventName,
} from './utils/streamRecords';

/**
 * Analyze lead records to update statistic data
 * With each tenant, following metrics will be analyzed:
 * 1. Number of leads
 *
 *
 * @param records Lead records to handle
 */
async function handlerTenantHistoricalChanges(
  tenant: string,
  groupedRecords: RequiredDynamoDBRecord[],
): Promise<void> {
  logger.log(`Handle historical changes for tenant ${tenant} ${groupedRecords}`);
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    const { Records: records } = event;
    logger.log(`Start handling DynamoDB Stream event records ${JSON.stringify(records, null, 5)}`);

    if (!records || records.length === 0) {
      logger.log('No DynamoDB records to handle');
    }

    // Transform records to make sure that:
    // 1. Records are sorted by SequenceNumber
    // 2. Records are sorted by pk and sk
    // 3. Records are unique by pk#sk
    // Only need to handle newest records of the same model and event type type
    // combined by pk, sk and event name
    const compactedRecords = _.remove(records, isNeededHandleRecord) as RequiredDynamoDBRecord[];
    const transformedRecords = _.chain(compactedRecords)
      .orderBy([
        (record) => {
          const { dynamodb } = record;
          return dynamodb!.SequenceNumber;
        },
        toPkSk,
      ], ['desc', 'asc'])
      .sortedUniqBy(toUniquePkSkEventName).value();

    // Group records by tenant
    const groupedbyTenantRecords = _.groupBy(transformedRecords, getTenant);
    logger.log(`Records by group need to handle ${JSON.stringify(groupedbyTenantRecords, null, 5)}`);

    // Start handling DynamoDB records to update statistic data
    // Data of all the tenants will be handled in parallel
    // There are two kinds of statistic data:
    // 1. Statistic data of the lead
    // 2. Statistic data of the booking
    // * Lambda handles maximum 100 (Batch size setup by Lambda trigger) records at a time
    // Number of records is large enough to reduce infrastructure cost and improve performance
    const tenantHandlerPromises = Object.keys(groupedbyTenantRecords).map(async (tenant) => {
      const tenantRecords = groupedbyTenantRecords[tenant];
      await handlerTenantHistoricalChanges(tenant, tenantRecords);
    });
    await Promise.all(tenantHandlerPromises);
  } catch (error) {
    logger.log(`Error occurred when handling DynamoDB Stream event ${error}`);
  }
};
