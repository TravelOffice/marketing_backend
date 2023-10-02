import { UserDeviceSessionRepositoryImpl } from './UserDeviceSessionRepositoryImpl';
import UserNotificationRepositoryImpl from './UserNotificationRepositoryImpl';
import { UserDeviceSessionRepository } from './interfaces/UserDeviceSessionRepository';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';
import { SubscribedUserRepositoryImpl } from './SubscribedUserRepositoryImpl';
import { SubscribedUserRepository } from './interfaces/SubscribedUserRepository';

interface Repositories {
  userDeviceSessionRepository: UserDeviceSessionRepository,
  userNotificationRepository: UserNotificationRepository,
  subscribedUserRepository: SubscribedUserRepository,
}

const repositories: Repositories = {
  userDeviceSessionRepository: new UserDeviceSessionRepositoryImpl(),
  userNotificationRepository: new UserNotificationRepositoryImpl(),
  subscribedUserRepository: new SubscribedUserRepositoryImpl(),
};

export const {
  userDeviceSessionRepository,
  userNotificationRepository,
  subscribedUserRepository,
} = repositories;
