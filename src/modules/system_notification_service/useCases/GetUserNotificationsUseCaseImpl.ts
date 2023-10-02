import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { CognitoUser } from '../models/CognitoUser';
import { userNotificationRepository } from '../repositories';
import { GetUserNotificationsUseCase } from './interfaces/GetUserNotificationsUseCase';

export default class GetUserNotificationsUseCaseImpl implements GetUserNotificationsUseCase {
  invoke = async (
    currentUser: CognitoUser,
    paginationParams: PaginationParams,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return userNotificationRepository.listByUser(currentUserId, paginationParams);
  };
}
