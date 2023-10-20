import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { userNotificationRepository } from '../repositories';
import { GetUserNotificationsUseCase } from './interfaces/GetUserNotificationsUseCase';
import { AppType } from '../models/UserDeviceSession';
import { UserNotification } from '../models/UserNotification';

export default class GetMarketplaceNotificationsUseCaseImpl implements GetUserNotificationsUseCase {
  invoke = async (
    currentUser: CognitoUser,
    appType: AppType,
    paginationParams: PaginationParams,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    const notifications = await userNotificationRepository.listByUser(
      currentUserId,
      appType,
      paginationParams,
    );
    const latestTimeMarkAllRead = await userNotificationRepository.getLatestTimeMarkAllRead(
      currentUserId,
      appType,
    );
    if (latestTimeMarkAllRead && notifications) {
      return {
        ...notifications,
        data: notifications?.data.map((notification) => {
          const notificationData = notification.data;
          return {
            ...notification,
            data: {
              ...notificationData,
              read: Number(notification.createdAt) > Number(latestTimeMarkAllRead) ? notificationData.read : 'read',
            },
          } as UserNotification;
        }),
      };
    }
    return notifications;
  };
}
