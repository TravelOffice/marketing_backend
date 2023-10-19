import { dynamoProvider, fcmProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { FCM_NOTIFICATION_TOPIC_INDEX, USERNAME_INDEX } from '../utils/constants';
import { SubscribedUserRepository } from './interfaces/SubscribedUserRepository';
import { SubscribedUser } from '../models/SubscribedUser';

export class SubscribedUserRepositoryImpl implements SubscribedUserRepository {
  create = async (
    topic: string,
    userId: string,
    deviceTokens: string[],
  ): Promise<void> => {
    // Subscribe to FCM topic
    await fcmProvider.subscribeToTopic(deviceTokens, topic);
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const pk = `${FCM_NOTIFICATION_TOPIC_INDEX}#${topic}`;
    const sk = `${USERNAME_INDEX}#${userId}`;
    await dynamoProvider.putItem(table, pk, sk, {
      topic,
      userId,
    });
  };

  listByTopic = async (
    topic: string,
  ): Promise<SubscribedUser[]> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const queryParams = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${FCM_NOTIFICATION_TOPIC_INDEX}#${topic}`,
        ':sk_filter': `${USERNAME_INDEX}#`,
      },
    };
    const subscribedUsers = await dynamoProvider.query<SubscribedUser>(queryParams);
    return subscribedUsers.map((item) => helper.excludeDataFromObject(item) as SubscribedUser);
  };

  listByUser = async (
    userId: string,
  ): Promise<SubscribedUser[]> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const queryParams = {
      TableName: table,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk and begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':sk': `${USERNAME_INDEX}#${userId}`,
        ':pk_filter': `${FCM_NOTIFICATION_TOPIC_INDEX}#`,
      },
    };
    const subscribedUsers = await dynamoProvider.query<SubscribedUser>(queryParams);
    return subscribedUsers.map((item) => helper.excludeDataFromObject(item) as SubscribedUser);
  };

  delete = async (
    topic: string,
    userId: string,
    deviceTokens: string[],
  ): Promise<void> => {
    // Unsubscribe from FCM topic
    await fcmProvider.unsubscribeTopic(deviceTokens, topic);
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    await dynamoProvider.deleteItem(
      table,
      `${FCM_NOTIFICATION_TOPIC_INDEX}#${topic}`,
      `${USERNAME_INDEX}#${userId}`,
    );
  };
}
