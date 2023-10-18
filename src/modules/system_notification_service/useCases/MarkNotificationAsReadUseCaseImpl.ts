import { CognitoUser } from '../models/CognitoUser';
import { userNotificationRepository } from '../repositories';
import { AppType } from '../models/UserDeviceSession';
import { MarkNotificationAsReadUseCase } from './interfaces/MarkNotificationAsReadUseCase';

export default class MarkNotificationAsReadUseCaseImpl implements MarkNotificationAsReadUseCase {
  invoke = async (
    currentUser: CognitoUser,
    appType: AppType,
    notificationId: string,
  ) => {
    const { tenant, username } = currentUser;
    const currentUserId = `${tenant}#${username}`;
    return userNotificationRepository.martAsRead(
      currentUserId,
      appType,
      notificationId,
    );
  };
}
