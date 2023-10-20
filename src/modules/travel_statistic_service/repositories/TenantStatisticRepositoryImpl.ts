import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import {
  BOOKING_INDEX, DEPARTURE_TOUR_INDEX, FILLING_RATIO_INDEX, LEAD_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { FilteringDuration } from '../models/FilteringDuration';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';
import { DepartureTourStatistic } from '../models/DepartureTourStatistic';
import { LeadStatistic } from '../models/LeadStatistic';
import { BookingStatistic } from '../models/BookingStatistic';
import { TourFillingRatioStatistic } from '../models/TourFillingRatioStatistic';
import { Session, SessionQueryParams } from '../models/SessionStatistic';

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

  getFillingRatioStatistic = async (
    tenant: string,
    paginationParams: PaginationParams,
  ) => {
    const pk = `${TENANT_INDEX}#${tenant}#${FILLING_RATIO_INDEX}`;
    const excludeKeys = [
      'pk',
    ] as (keyof TourFillingRatioStatistic)[];
    const params = {
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    };
    return dynamoProvider.queryPagination<TourFillingRatioStatistic>(
      params,
      paginationParams,
      excludeKeys,
    );
  };

  private async queryStatistic<T>(pk: string, filteringDuration?: FilteringDuration) {
    if (filteringDuration) {
      const { startTime, endTime } = filteringDuration;
      return dynamoProvider.query<T>({
        TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
        IndexName: 'Index1',
        KeyConditionExpression: 'pk = :pk AND lsi1 BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':start': startTime,
          ':end': endTime,
        },
      });
    }

    return dynamoProvider.query<T>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
  }

  getTotalSessionOrgByParams = async (
    tenant: string,
    params?: SessionQueryParams,
  ) => {
    // Default query params
    let IndexName;
    let KeyConditionExpression = 'pk = :pk';
    const ExpressionAttributeValues: any = {
      ':pk': params?.username ? `TN#${tenant}#${params.username}#ACS` : `TN#${tenant}#OCS`,
    };
    // Setup query params by specific param
    if (params?.conversationId) {
      KeyConditionExpression += ' AND begins_with(sk, :bw)';
      ExpressionAttributeValues[':bw'] = params.conversationId;
    } else if (params?.duration) {
      IndexName = 'Index2';
      KeyConditionExpression += ' AND lsi2 BETWEEN :start AND :end';
      ExpressionAttributeValues[':start'] = '000010';
      ExpressionAttributeValues[':end'] = params.duration;
    } else if (params?.status) {
      IndexName = 'Index3';
      KeyConditionExpression += ' AND lsi3 = :lsi3';
      ExpressionAttributeValues[':lsi3'] = params.status;
    } else if (params?.startTime) {
      IndexName = 'Index1';
      KeyConditionExpression += ' AND lsi1 BETWEEN :start AND :end';
      ExpressionAttributeValues[':start'] = params.startTime;
      ExpressionAttributeValues[':end'] = Date.now().toString();
    }
    // Query data
    return dynamoProvider.query<Session>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      IndexName,
      KeyConditionExpression,
      ExpressionAttributeValues,
    });
  };
}
