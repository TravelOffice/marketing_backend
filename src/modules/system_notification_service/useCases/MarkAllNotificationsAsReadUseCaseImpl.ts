import { CognitoUser } from '../models/CognitoUser';
import { userNotificationRepository } from '../repositories';
import { AppType } from '../models/UserDeviceSession';
import { MarkAllNotificationsAsReadUseCase } from './interfaces/MarkAllNotificationsAsReadUseCase';

export default class MarkAllNotificationsAsReadUseCaseImpl
implements MarkAllNotificationsAsReadUseCase {
  invoke = async (
    currentUser: CognitoUser,
    appType: AppType,
    markedTime: number,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return userNotificationRepository.markAllRead(
      currentUserId,
      appType,
      markedTime,
    );
  };
}
