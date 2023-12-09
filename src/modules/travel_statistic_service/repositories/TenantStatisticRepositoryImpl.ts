import { dynamoProvider } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { BookingStatistic } from '../models/BookingStatistic';
import { ChatSessionQueryParams, ChatSessionStatistic } from '../models/ChatSessionStatistic';
import { DepartureTourStatistic } from '../models/DepartureTourStatistic';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { LeadStatistic } from '../models/LeadStatistic';
import { TourFillingRatioStatistic } from '../models/TourFillingRatioStatistic';
import {
  ASSIGNEE_CHAT_SESSION_STATISTIC_INDEX,
  BOOKING_INDEX,
  DEPARTURE_TOUR_INDEX,
  DURATION_PADDING_ZERO_LENGTH,
  FILLING_RATIO_INDEX,
  LEAD_CREATE_FROM_CHAT_INDEX,
  LEAD_INDEX, ORG_CHAT_SESSION_STATISTIC_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { padZeroToLeft } from '../utils/number';
import { TenantStatisticRepository } from './interfaces/TenantStatisticRepository';

export default class TenantStatisticRepositoryImpl implements TenantStatisticRepository {
  getDepartureTourStatistic = async (tenant: string, filteringDuration?: FilteringTimeRange) => {
    const pk = `${TENANT_INDEX}#${tenant}#${DEPARTURE_TOUR_INDEX}`;
    return this.queryStatistic<DepartureTourStatistic>(pk, filteringDuration);
  };

  getLeadStatistic = async (tenant: string, filteringDuration?: FilteringTimeRange) => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    return this.queryStatistic<LeadStatistic>(pk, filteringDuration);
  };

  getLeadCreatedFromChatStatistic = async (
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ) => {
    const pk = `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`;
    if (filteringDuration) {
      const { startTime, endTime } = filteringDuration;
      return dynamoProvider.query<LeadStatistic>({
        TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
        IndexName: 'Index4', // FROMCHAT#createdAt
        KeyConditionExpression: 'pk = :pk AND lsi4 BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':start': `${LEAD_CREATE_FROM_CHAT_INDEX}#${startTime}`,
          ':end': `${LEAD_CREATE_FROM_CHAT_INDEX}#${endTime}`,
        },
      });
    }

    return dynamoProvider.query<LeadStatistic>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      IndexName: 'Index4', // FROMCHAT#createdAt
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
  };

  getBookingStatistic = async (tenant: string, filteringDuration?: FilteringTimeRange) => {
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

  private async queryStatistic<T>(pk: string, filteringDuration?: FilteringTimeRange) {
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
    params?: ChatSessionQueryParams,
  ) => {
    // Default query params
    let indexName;
    let conditionExpression = 'pk = :pk';
    const attributeValues: any = {
      ':pk': params?.username
        ? `${TENANT_INDEX}#${tenant}#${params.username}#${ASSIGNEE_CHAT_SESSION_STATISTIC_INDEX}`
        : `${TENANT_INDEX}#${tenant}#${ORG_CHAT_SESSION_STATISTIC_INDEX}`,
    };
    // Setup query params by specific param
    if (params?.conversationId) {
      conditionExpression += ' AND begins_with(sk, :bw)';
      attributeValues[':bw'] = params.conversationId;
    } else if (params?.duration) {
      indexName = 'Index2';
      conditionExpression += ' AND lsi2 <= :comparedDuration';
      attributeValues[':comparedDuration'] = padZeroToLeft(params.duration, DURATION_PADDING_ZERO_LENGTH);
    } else if (params?.status) {
      indexName = 'Index3';
      conditionExpression += ' AND lsi3 = :lsi3';
      attributeValues[':lsi3'] = params.status;
    } else if (params?.startTime) {
      indexName = 'Index1';
      conditionExpression += ' AND lsi1 BETWEEN :start AND :end';
      attributeValues[':start'] = params.startTime;
      attributeValues[':end'] = Date.now().toString();
    }
    // Query data
    return dynamoProvider.query<ChatSessionStatistic>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      IndexName: indexName,
      KeyConditionExpression: conditionExpression,
      ExpressionAttributeValues: attributeValues,
    });
  };
}
