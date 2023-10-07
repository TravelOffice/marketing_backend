import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { SaleStatisticRepository } from './interfaces/SaleStatisticRepository';
import { FilteringDuration } from '../models/FilteringDuration';
import {
  BOOKING_INDEX, LEAD_INDEX, SALE_STATISTIC_INDEX, TENANT_INDEX,
} from '../utils/constants';

export default class SaleStatisticRepositoryImpl implements SaleStatisticRepository {
  getTotalLead = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    const filteringSk = `${SALE_STATISTIC_INDEX}#${saleId}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, filteringSk, filteringDuration)
      : await this.queryStatisticAllTime(pk, filteringSk);
    return records.length;
  };

  getTotalBooking = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<number> => {
    const pk = `${TENANT_INDEX}#${tenant}#${saleId}#${BOOKING_INDEX}`;
    const filteringSk = `${SALE_STATISTIC_INDEX}#${saleId}`;
    const records = filteringDuration
      ? await this.queryStatisticWithDuration(pk, filteringSk, filteringDuration)
      : await this.queryStatisticAllTime(pk, filteringSk);
    return records.length;
  };

  private async queryStatisticAllTime<T>(pk: string, filteringSk: string) {
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'pk = :pk ADN begins_with(stSk, :sk)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':sk': `${filteringSk}#`,
      },
    });
  }

  private async queryStatisticWithDuration<T>(
    pk: string,
    filteringSk: string,
    filteringDuration: FilteringDuration,
  ) {
    const { startTime, endTime } = filteringDuration;
    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      IndexName: 'StatisticGSI',
      KeyConditionExpression: 'stPk = :pk AND stSk BETWEEN :start AND :end',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':start': `${filteringSk}#${startTime}`,
        ':end': `${filteringSk}#${endTime}`,
      },
    });
  }
}
