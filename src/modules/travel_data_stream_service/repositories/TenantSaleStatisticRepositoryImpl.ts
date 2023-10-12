import { getAwsSecretValue } from 'get-env';
import { BatchWriteItemInput } from 'core/providers/dynamodb/DynamoProvider';
import { dynamoProvider } from 'core';
import { MetricSaleAnalyzerResult } from '../models/statistic/TenantSaleAnalyzerResult';
import { TenantSaleStatisticRepository } from './interfaces/TenantSaleStatisticRepository';

export default class TenantSaleStatisticRepositoryImpl implements TenantSaleStatisticRepository {
  /**
   * Method to write statistic items to database
   * Each item can be:
   * - Lead statistic item
   * - Booking statistic item
   * - Tour with filling ratio statistic item
   * - Departure statistic item
   *
   * @param items Statistic items to be written to database
   */
  batchWriteSaleStatistics = async (items: MetricSaleAnalyzerResult[]) => {
    // No need to write if there is no item
    if (items.length === 0) {
      return;
    }

    // Write statistic items to database
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const requests = items.map((item) => ({
      PutRequest: { Item: item },
    }));
    const RequestItems = {
      RequestItems: {
        [statisticTable]: requests,
      },
    } as BatchWriteItemInput;
    await dynamoProvider.batchWriteItem(RequestItems);
  };

  /**
   * Method to delete statistic items from database
   * Each item can be:
   * - Lead statistic item
   * - Booking statistic item
   * - Tour with filling ratio statistic item
   * - Departure statistic item
   *
   * @param items Statistic items to be deleted from database
   */
  batchDeleteSaleStatistics = async (items: MetricSaleAnalyzerResult[]) => {
    // No need to delete if there is no item
    if (items.length === 0) {
      return;
    }

    // Delete statistic items from database
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    const input: BatchWriteItemInput = {
      RequestItems: {
        [statisticTable]: items.map((item) => ({
          DeleteRequest: {
            // `index` contains pk and sk values
            Key: {
              pk: item.pk,
              sk: item.sk,
            },
          },
        })),
      },
    };
    await dynamoProvider.batchWriteItem(input);
  };

  deleteStatisticItem = async (pk: string, sk: string) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    await dynamoProvider.deleteItem(statisticTable, pk, sk);
  };
}
