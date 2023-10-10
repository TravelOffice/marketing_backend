import { DynamoDBStreamEvent } from 'aws-lambda';
import * as _ from 'lodash';
import TenantSaleAnalyzer from './analyzer/TenantSaleAnalyzer';
import { RequiredDynamoDBRecord } from './types/dynamodb';
import logger from './utils/logger';
import {
  getTenant,
  isNeededHandleRecord,
  toPkSk,
  toUniquePkSkEventName,
} from './utils/streamRecords';
import { tenantSaleStatisticRepository } from './repositories';

/**
 * Analyze records for each tenant to update statistic data
 * Statistic items will be stored to database in batch
 *
 * @param tenant Tenant id
 * @param records Records to handle
 */
async function analyzeTenantSaleData(
  tenant: string,
  groupedRecords: RequiredDynamoDBRecord[],
): Promise<void> {
  // Analyze sale data including leads / bookings / departure tours
  logger.log(`Start analyzing sale data of tenant ${tenant}`);
  const tenantAnalyzer = new TenantSaleAnalyzer(tenant, groupedRecords);
  await tenantAnalyzer.analyze();

  // Store analyzed data to database
  const saleStatisticItems = tenantAnalyzer.analyzedData;
  if (saleStatisticItems.length === 0) {
    logger.log(`No sale statistic items of tenant ${tenant} to store`);
    return;
  }

  await tenantSaleStatisticRepository.batchWriteSaleStatistics(saleStatisticItems);
  logger.table(`Stored sale statistic items of tenant ${tenant} with data`, saleStatisticItems);
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

    // Start handling DynamoDB records to update statistic data
    // Data of all the tenants will be handled in parallel
    // There are two kinds of statistic data:
    // 1. Statistic data of the lead
    // 2. Statistic data of the booking
    // 3. Statistic data of the departure tour
    // * Lambda handles maximum 100 (Batch size setup by Lambda trigger) records at a time
    // Number of records is large enough to reduce infrastructure cost and improve performance
    const tenantHandlerPromises = Object.keys(groupedbyTenantRecords).map(async (tenant) => {
      const tenantRecords = groupedbyTenantRecords[tenant];
      await analyzeTenantSaleData(tenant, tenantRecords);
    });
    await Promise.all(tenantHandlerPromises);
  } catch (error) {
    logger.log(`Error occurred when handling DynamoDB Stream event ${error}`);
  }
};
