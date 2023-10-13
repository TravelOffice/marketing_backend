import { SendUserNotificationsUseCase } from './interfaces/SendUserNotificationsUseCase';
import { CreateUserNotificationDto } from '../models/UserNotification';
import { userNotificationRepository } from '../repositories';
import { AppType } from '../models/UserDeviceSession';

export default class SendUserNotificationsUseCaseImpl implements SendUserNotificationsUseCase {
  invoke = async (
    topic: string,
    appType: AppType,
    createUserNotificationDto: CreateUserNotificationDto,
  ) => userNotificationRepository.sendToTopic(topic, appType, createUserNotificationDto);
}
