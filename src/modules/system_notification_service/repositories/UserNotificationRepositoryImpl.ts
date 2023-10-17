import { BatchWriteItemInput, PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, fcmProvider, logger } from 'core';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';
import { CreateUserNotificationDto, UserNotification } from '../models/UserNotification';
import { USER_NOTIFICATION_INDEX, USERNAME_INDEX } from '../utils/constants';
import { subscribedUserRepository } from './index';
import { SubscribedUser } from '../models/SubscribedUser';
import { AppType } from '../models/UserDeviceSession';

export default class UserNotificationRepositoryImpl implements UserNotificationRepository {
  /**
   * Lists all notifications of user sorted by createdAt (lsi1)
   * @param currentUserId - The ID of the user that own access token in the request.
   * @param appType
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<UserNotification> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByUser = async (
    currentUserId: string,
    appType: AppType,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<UserNotification> | undefined> => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const queryParams = {
      TableName: marketplaceTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`,
        ':sk': `${appType}#`,
      },
    };
    return dynamoProvider.queryPagination<UserNotification>(
      queryParams,
      paginationParams,
    );
  };

  sendToTopic = async (
    topic: string,
    appType: AppType,
    createUserNotificationDto: CreateUserNotificationDto,
  ): Promise<void> => {
    const {
      title,
      body,
      href,
      type,
    } = createUserNotificationDto;
    const payload = {
      data: {
        href, type, read: 'unread',
      },
      notification: { title, body },
    };
    const notificationId = await fcmProvider.sendMessageToTopic(topic, payload);
    logger.log(`Send notification to ${topic} successfully`);
    const subscribedUsers = await subscribedUserRepository.listByTopic(topic);
    logger.log(`Get subscribed users of topic ${topic}: ${JSON.stringify(subscribedUsers)}`);
    const batchWriteInput = this.buildBatchWriteNotifications({
      id: notificationId.toString(),
      title,
      body,
      type,
      href,
      read: 'unread',
    }, subscribedUsers);
    if (batchWriteInput.length > 0) {
      await this.executeBatchWrite(batchWriteInput);
      logger.log(`Save notification ${notificationId} to dynamodb successfully`);
    }
  };

  private buildBatchWriteNotifications = (
    notification: Partial<UserNotification>,
    users: SubscribedUser[],
  ) => users.map((user) => {
    // Construct the partition key for customers
    const pk = `${USERNAME_INDEX}#${user.userId}#${USER_NOTIFICATION_INDEX}`;
    // Construct the sort key for the customer
    const sk = notification.id;

    // Get the current timestamp
    const now = Date.now();

    // Construct the Item object for the PutRequest
    return {
      ...notification,
      pk,
      sk,
      createdAt: now,
      updatedAt: now,
    };
  });

  private executeBatchWrite = async <T>(param: T[]) => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const requests = param.map((item) => ({
      PutRequest: { Item: item },
    }));
    const requestItems = {
      RequestItems: {
        [table]: requests,
      },
    } as BatchWriteItemInput;
    return dynamoProvider.batchWriteItem(requestItems);
  };
}
