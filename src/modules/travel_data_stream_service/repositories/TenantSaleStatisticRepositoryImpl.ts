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

  deleteStatisticItem = async (pk: string, sk: string) => {
    const statisticTable = await getAwsSecretValue('DYNAMO_STATISTIC_TABLE');
    await dynamoProvider.deleteItem(statisticTable, pk, sk);
  };
}
