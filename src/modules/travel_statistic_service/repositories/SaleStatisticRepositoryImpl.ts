import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { SaleStatisticRepository } from './interfaces/SaleStatisticRepository';
import { FilteringDuration } from '../models/FilteringDuration';
import { BOOKING_INDEX, LEAD_INDEX, TENANT_INDEX } from '../utils/constants';
import { LeadStatistic } from '../models/LeadStatistic';
import { BookingStatistic } from '../models/BookingStatistic';

export default class SaleStatisticRepositoryImpl implements SaleStatisticRepository {
  getLeadStatistic = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<LeadStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    return this.queryStatistic<LeadStatistic>(pk, saleId, filteringDuration);
  };

  getBookingStatistic = async (
    tenant: string,
    saleId: string,
    filteringDuration?: FilteringDuration | undefined,
  ): Promise<BookingStatistic[]> => {
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    return this.queryStatistic<BookingStatistic>(pk, saleId, filteringDuration);
  };

  private async queryStatistic<T>(
    pk: string,
    saleId: string,
    filteringDuration?: FilteringDuration,
  ) {
    if (filteringDuration) {
      const { startTime, endTime } = filteringDuration;
      return dynamoProvider.query<T>({
        TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
        IndexName: 'Index2',
        KeyConditionExpression: 'pk = :pk AND lsi2 BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':start': `${saleId}#${startTime}`,
          ':end': `${saleId}#${endTime}`,
        },
      });
    }

    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      IndexName: 'Index2',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi2, :lsi2)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':lsi2': `${saleId}#`,
      },
    });
  }
}
