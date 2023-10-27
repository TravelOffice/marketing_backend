import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { ChatSessionStatistic } from '../models/ChatSessionStatistic';
import { FilteringTimeRange } from '../models/FilteringDuration';
import { CONVERSATION_STATISTIC_INDEX, ORG_CHAT_SESSION_STATISTIC_INDEX, TENANT_INDEX } from '../utils/constants';
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
        IndexName: 'Index1', // createdAt
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

  getConversationPlatformStatistic = async (
    tenant: string,
    startTime: string,
    endTime: string,
  ) => dynamoProvider.query({
    TableName: await getAwsSecretValue('DYNAMO_STATISTIC_TABLE'),
    IndexName: 'Index1', // createdAt
    KeyConditionExpression: 'pk = :pk AND lsi1 BETWEEN :start AND :end',
    ExpressionAttributeValues: {
      ':pk': `${TENANT_INDEX}#${tenant}#${CONVERSATION_STATISTIC_INDEX}`,
      ':start': startTime,
      ':end': endTime,
    },
  });
}
