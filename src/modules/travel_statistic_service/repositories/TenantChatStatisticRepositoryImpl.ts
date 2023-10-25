import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { ChatSessionStatistic } from '../models/ChatSessionStatistic';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { ORG_CHAT_SESSION_STATISTIC_INDEX, TENANT_INDEX } from '../utils/constants';
import { TenantChatStatisticRepository } from './interfaces/TenantChatStatisticRepository';

export default class TenantChatStatisticRepositoryImpl implements TenantChatStatisticRepository {
  getChatSessionStatistic = async (
    tenant: string,
    filteringDuration?: FilteringTimeRange,
  ) => {
    const pk = `${TENANT_INDEX}#${tenant}#${ORG_CHAT_SESSION_STATISTIC_INDEX}`;
    if (filteringDuration) {
      const { startTime, endTime } = filteringDuration;
      return dynamoProvider.query<ChatSessionStatistic>({
        TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
        IndexName: 'Index1', // FROMCHAT#createdAt
        KeyConditionExpression: 'pk = :pk AND lsi1 BETWEEN :start AND :end',
        ExpressionAttributeValues: {
          ':pk': pk,
          ':start': startTime,
          ':end': endTime,
        },
      });
    }

    return dynamoProvider.query<ChatSessionStatistic>({
      TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });
  };
}
