import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { SaleStatisticRepository } from './interfaces/SaleStatisticRepository';
import { FilteringDuration } from '../models/FilteringDuration';
import { BOOKING_INDEX, LEAD_INDEX, TENANT_INDEX } from '../utils/constants';

export default class SaleStatisticRepositoryImpl implements SaleStatisticRepository {
  getTotalLead = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${saleId}#${LEAD_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, filteringDuration)
      : await this.queryStatisticAllTime(pk);
    return records.length;
  };

  getTotalBooking = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${saleId}#${BOOKING_INDEX}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, filteringDuration)
      : await this.queryStatisticAllTime(pk);
    return records.length;
  };

  private async queryStatisticAllTime<T>(pk: string) {
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'stPk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
  }

  private async queryStatisticWithDuration<T>(
    pk: string,
    filteringDuration: FilteringDuration,
  ) {
    const { startTime, endTime } = filteringDuration;
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'stPk = :pk AND stSk BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':start': startTime,
        ':end': endTime,
      },
    });
  }
}
