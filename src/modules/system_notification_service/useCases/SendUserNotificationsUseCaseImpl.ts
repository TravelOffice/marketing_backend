import { CognitoUser } from '../models/CognitoUser';
import { userNotificationRepository } from '../repositories';
import { SendUserNotificationsUseCase } from './interfaces/SendUserNotificationsUseCase';
import { CreateUserNotificationDto } from '../models/UserNotification';

export default class SendUserNotificationsUseCaseImpl implements SendUserNotificationsUseCase {
  invoke = async (
    topic: string,
    currentUser: CognitoUser,
    createUserNotificationDto: CreateUserNotificationDto,
  ) => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    return userNotificationRepository.sendToTopic(topic, userId, createUserNotificationDto);
  };
}
