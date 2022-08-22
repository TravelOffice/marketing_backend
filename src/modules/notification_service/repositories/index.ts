import { NotificationRepository } from './interfaces/NotificationRepository';
import NotificationRepositoryImpl from './NotificationRepositoryImpl';

interface Repositories {
  notificationRepository: NotificationRepository,
}

const repositories: Repositories = {
  notificationRepository: new NotificationRepositoryImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const { notificationRepository } = repositories;
