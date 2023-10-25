import * as _ from 'lodash';
import { _Record } from '@aws-sdk/client-dynamodb-streams';
import TenantSaleAnalyzer from './analyzer/TenantSaleAnalyzer';
import { RequiredDynamoDBRecord } from './types/dynamodb';
import logger from './utils/logger';
import { getTenant, isNeededHandleRecord, toPkSk } from './utils/streamRecords';
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

  // Store or delete analyzed data to database
  const { modifiedItems, deletedItems } = tenantAnalyzer;
  if (modifiedItems.length === 0 && deletedItems.length === 0) {
    logger.log(`No sale statistic items of tenant ${tenant} to update`);
    return;
  }

  await tenantSaleStatisticRepository.batchWriteSaleStatistics(modifiedItems);
  logger.table(`Stored sale statistic items of tenant ${tenant} with data`, modifiedItems);

  await tenantSaleStatisticRepository.batchDeleteSaleStatistics(deletedItems);
  logger.table(`Deleted sale statistic items of tenant ${tenant} with data`, deletedItems);
}

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event: { Records: _Record[] }): Promise<void> => {
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
      .sortedUniqBy(toPkSk).value();

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
