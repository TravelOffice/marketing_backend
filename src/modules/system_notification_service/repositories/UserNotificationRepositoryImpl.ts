import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, fcmProvider } from 'core';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';
import { CreateUserNotificationDto, UserNotification } from '../models/UserNotification';
import { USER_NOTIFICATION_INDEX, USERNAME_INDEX } from '../utils/constants';

export default class UserNotificationRepositoryImpl implements UserNotificationRepository {
  /**
   * Lists all notifications of user sorted by createdAt (lsi1)
   * @param currentUserId - The ID of the user that own access token in the request.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<UserNotification> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByUser = async (
    currentUserId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<UserNotification> | undefined> => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`,
      },
    };
    return dynamoProvider.queryPagination<UserNotification>(
      queryParams,
      paginationParams,
    );
  };

  sendToTopic = async (
    topic: string,
    userId: string,
    createUserNotificationDto: CreateUserNotificationDto,
  ): Promise<void> => {
    const {
      model,
      code,
      action,
      notification,
    } = createUserNotificationDto;
    const payload = {
      data: { model, code, action },
      notification: { ...notification },
    };
    const notificationId = await fcmProvider.sendMessageToTopic(topic, payload);
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const pk = `${USERNAME_INDEX}#${userId}#${USER_NOTIFICATION_INDEX}`;
    const sk = notificationId.toString();
    await dynamoProvider.putItem(table, pk, sk, createUserNotificationDto);
  };
}
