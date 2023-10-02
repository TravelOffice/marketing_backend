import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';
import { UserNotification } from '../models/UserNotification';
import { USERNAME_INDEX, USER_NOTIFICATION_INDEX } from '../utils/constants';

export default class UserNotificationRepositoryImpl implements UserNotificationRepository {
  /**
   * Lists all notifications of user sorted by createdAt (lsi1)
   * @param currentUserId - The ID of the user that own access token in the request.
   * @param tenant - Tenant id that user belongs to.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<UserNotification> | undefined>}
   * A promise resolving to a paginated response.
   */
  listByUser = async (
    currentUserId: string,
    paginationParams: PaginationParams,
  ) => {
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
}
