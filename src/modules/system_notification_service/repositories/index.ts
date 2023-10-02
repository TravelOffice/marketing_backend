import { UserDeviceSessionRepositoryImpl } from './UserDeviceSessionRepositoryImpl';
import UserNotificationRepositoryImpl from './UserNotificationRepositoryImpl';
import { UserDeviceSessionRepository } from './interfaces/UserDeviceSessionRepository';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';

interface Repositories {
  userDeviceSessionRepository: UserDeviceSessionRepository,
  userNotificationRepository: UserNotificationRepository,
}

const repositories: Repositories = {
  userDeviceSessionRepository: new UserDeviceSessionRepositoryImpl(),
  userNotificationRepository: new UserNotificationRepositoryImpl(),
};

export const {
  userDeviceSessionRepository,
  userNotificationRepository,
} = repositories;
