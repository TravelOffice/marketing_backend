import { BatchWriteItemInput, PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, logger } from 'core';
import { fcmProvider } from 'fcm';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';
import { CreateUserNotificationDto, UserNotification } from '../models/UserNotification';
import {
  COUNTER_INDEX,
  LATEST_READ_NOTIFICATION,
  NOTIFICATION_INDEX,
  USER_NOTIFICATION_INDEX,
  USERNAME_INDEX,
} from '../utils/constants';
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
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const queryParams = {
      TableName: table,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi1)',
      ExpressionAttributeValues: {
        ':pk': `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`,
        ':lsi1': `${appType}#`,
      },
    };
    return dynamoProvider.queryPagination<UserNotification>(
      queryParams,
      paginationParams,
    );
  };

  /**
   * Retrieves the latest time when all notifications were marked as read
   * for a specific user and application type.
   *
   * @param currentUserId - The unique identifier of the current user.
   * @param appType - The type of the application (e.g., 'MARKETPLACE').
   * @returns The timestamp representing the latest time when notifications were marked as read,
   * or undefined if no such record exists.
   */
  getLatestTimeMarkAllRead = async (
    currentUserId: string,
    appType: AppType,
  ): Promise<number | undefined> => {
    // Access the DynamoDB table where notification data is stored.
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');

    // Define the primary and sort keys for the query.
    const pk = `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`;
    const sk = `${appType}#${LATEST_READ_NOTIFICATION}`;

    // Query the DynamoDB table to retrieve the marked time.
    const result = await dynamoProvider.getItem(table, pk, sk);

    // If a result is found, return the marked time; otherwise, return undefined.
    if (result) {
      return result.markedTime;
    }
    return undefined;
  };

  /**
   * Sends a notification to a specified topic within a particular application type.
   *
   * @param topic - The topic to which the notification is sent.
   * @param appType - The type of the application (e.g., 'MARKETPLACE').
   * @param createUserNotificationDto - The data for creating the user notification,
   * including notification content and data payload.
   * @returns A Promise that resolves when the notification has been sent successfully.
   */
  sendToTopic = async (
    topic: string,
    appType: AppType,
    createUserNotificationDto: CreateUserNotificationDto,
  ): Promise<void> => {
    const { notification, data } = createUserNotificationDto;

    // Send the notification to the specified topic using FCM (Firebase Cloud Messaging).
    // Handle error when registration tokens are no longer exist
    try {
      await fcmProvider.sendMessageToTopic(topic, createUserNotificationDto);
    } catch (error) {
      logger.log(error);
    }

    const notificationId = await this.generateCode();

    // Log a success message for the sent notification.
    logger.log(`Send notification to ${topic} successfully`);

    // Retrieve the list of users subscribed to the topic.
    const subscribedUsers = await subscribedUserRepository.listByTopic(topic);

    // Log information about the subscribed users for this topic.
    logger.log(`Get subscribed users of topic ${topic}: ${JSON.stringify(subscribedUsers)}`);

    // Prepare the notifications and data for saving in the DynamoDB.
    const batchWriteInput = this.buildBatchWriteNotifications(
      {
        notification,
        data: {
          ...data,
          id: notificationId,
        },
      },
      subscribedUsers,
      appType,
    );

    // If there are notifications to save, execute the batch write to DynamoDB.
    if (batchWriteInput.length > 0) {
      await this.executeBatchWrite(batchWriteInput);
      logger.log(`Save notification ${notificationId} to DynamoDB successfully`);
    }
  };

  /**
   * Marks all notifications as read for a specific user within the given application type.
   *
   * @param currentUserId - The ID of the user for whom notifications are marked as read.
   * @param appType - The type of the application (e.g., 'MARKETPLACE').
   * @param markedTime - The timestamp representing when the notifications are marked as read.
   * @returns A Promise that resolves when the notifications are successfully marked as read.
   */
  markAllRead = async (
    currentUserId: string,
    appType: AppType,
    markedTime: number,
  ): Promise<void> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const pk = `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`;
    const sk = `${appType}#${LATEST_READ_NOTIFICATION}`;
    await dynamoProvider.putItem(table, pk, sk, {
      markedTime,
    });
  };

  /**
   * Marks a specific notification as read for a user within the given application type.
   *
   * @param currentUserId - The ID of the user who is marking the notification as read.
   * @param appType - The type of the application (e.g., 'MARKETPLACE').
   * @param notificationId - The ID of the notification to be marked as read.
   * @returns A Promise that resolves when the notification is successfully marked as read.
   */
  martAsRead = async (
    currentUserId: string,
    appType: AppType,
    notificationId: string,
  ): Promise<void> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const pk = `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`;
    const sk = `${appType}#${notificationId}`;
    const notification = await this.listById(currentUserId, appType, notificationId);
    if (!notification) throw new Error(`Notification ${notificationId} doesn't exist`);
    const { data } = notification;
    await dynamoProvider.updateItemWithSetExpression(
      table,
      pk,
      sk,
      {
        data: {
          ...data,
          read: 'read',
        },
        updatedAt: Date.now(),
      },
    );
  };

  private listById = async (
    currentUserId: string,
    appType: AppType,
    notificationId: string,
  ): Promise<UserNotification | undefined> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const pk = `${USERNAME_INDEX}#${currentUserId}#${USER_NOTIFICATION_INDEX}`;
    const sk = `${appType}#${notificationId}`;
    return dynamoProvider.getItem<UserNotification>(
      table,
      pk,
      sk,
    );
  };

  /**
   * Method to generate notification code
   */
  private generateCode = async () => {
    try {
      const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
      const count = await helper.generateCode(
        table,
        NOTIFICATION_INDEX,
        COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log(`Error during increment operation for notification: ${error}`);
      throw error;
    }
  };

  private buildBatchWriteNotifications = (
    notification: Partial<UserNotification>,
    users: SubscribedUser[],
    appType: AppType,
  ) => users.map((user) => {
    // Construct the partition key for customers
    const pk = `${USERNAME_INDEX}#${user.userId}#${USER_NOTIFICATION_INDEX}`;
    // Construct the sort key for the customer
    const sk = `${appType}#${notification.data?.id}`;

    // Get the current timestamp
    const now = Date.now();

    // Construct the Item object for the PutRequest
    return {
      ...notification,
      pk,
      sk,
      lsi1: `${appType}#${now}`,
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
