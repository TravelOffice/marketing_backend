import { CognitoUser } from '../../models/CognitoUser';
import { CreateUserNotificationDto } from '../../models/UserNotification';

export interface SendUserNotificationsUseCase {
  invoke(
    topic: string,
    currentUser: CognitoUser,
    createUserNotificationDto: CreateUserNotificationDto,
  ): Promise<void>,
}
