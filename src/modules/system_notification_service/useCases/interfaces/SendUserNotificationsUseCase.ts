import { CreateUserNotificationDto } from '../../models/UserNotification';
import { AppType } from '../../models/UserDeviceSession';

export interface SendUserNotificationsUseCase {
  invoke(
    topic: string,
    appType: AppType,
    createUserNotificationDto: CreateUserNotificationDto,
  ): Promise<void>,
}
