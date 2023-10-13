import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { userNotificationRepository } from '../repositories';
import { GetUserNotificationsUseCase } from './interfaces/GetUserNotificationsUseCase';
import { AppType } from '../models/UserDeviceSession';

export default class GetMarketplaceNotificationsUseCaseImpl implements GetUserNotificationsUseCase {
  invoke = async (
    currentUser: CognitoUser,
    appType: AppType,
    paginationParams: PaginationParams,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return userNotificationRepository.listByUser(
      currentUserId,
      appType,
      paginationParams,
    );
  };
}
