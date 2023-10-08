import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import {
  BOOKING_INDEX, DEPARTURE_TOUR_INDEX, FILLING_RATIO_INDEX, LEAD_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { FilteringDuration } from '../models/FilteringDuration';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';
import {
  BookingStatistic,
  DepartureTourStatistic,
  FillingRatioStatistic,
  LeadStatistic,
} from '../models/TenantStatistic';

export default class TenantStatisticRepositoryImpl implements TenantStatisticRepository {
  getDepartureTourStatistic = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}#${DEPARTURE_TOUR_INDEX}`;
    return this.queryStatistic<DepartureTourStatistic>(pk, filteringDuration);
  };

  getLeadStatistic = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    return this.queryStatistic<LeadStatistic>(pk, filteringDuration);
  };

  getBookingStatistic = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}#${BOOKING_INDEX}`;
    return this.queryStatistic<BookingStatistic>(pk, filteringDuration);
  };

  getFillingRatioStatistic = async (tenant: string, filteringDuration?: FilteringDuration) => {
    const pk = `${TENANT_INDEX}#${tenant}#${FILLING_RATIO_INDEX}`;
    return this.queryStatistic<FillingRatioStatistic>(pk, filteringDuration);
  };

  private async queryStatistic<T>(pk: string, filteringDuration?: FilteringDuration) {
    if (filteringDuration) {
      const { startTime, endTime } = filteringDuration;
      return dynamoProvider.query<T>({
        TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
        KeyConditionExpression: 'pk = :pk AND sk BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':start': startTime,
          ':end': endTime,
        },
      });
    }

    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
  }
}
