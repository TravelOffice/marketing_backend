import { UserDeviceSessionRepositoryImpl } from './UserDeviceSessionRepositoryImpl';
import UserNotificationRepositoryImpl from './UserNotificationRepositoryImpl';
import { UserDeviceSessionRepository } from './interfaces/UserDeviceSessionRepository';
import { UserNotificationRepository } from './interfaces/UserNotificationRepository';
import { SubscribedUserRepositoryImpl } from './SubscribedUserRepositoryImpl';
import { SubscribedUserRepository } from './interfaces/SubscribedUserRepository';
import { TourPostRepository } from './interfaces/TourPostRepository';
import TourPostRepositoryImpl from './TourPostRepositoryImpl';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';

interface Repositories {
  userDeviceSessionRepository: UserDeviceSessionRepository,
  userNotificationRepository: UserNotificationRepository,
  subscribedUserRepository: SubscribedUserRepository,
  tourPostRepository: TourPostRepository,
  marketplaceUserReposity: MarketplaceUserRepository,
}

const repositories: Repositories = {
  userDeviceSessionRepository: new UserDeviceSessionRepositoryImpl(),
  userNotificationRepository: new UserNotificationRepositoryImpl(),
  subscribedUserRepository: new SubscribedUserRepositoryImpl(),
  tourPostRepository: new TourPostRepositoryImpl(),
  marketplaceUserReposity: new MarketplaceUserRepositoryImpl(),
};

export const {
  userDeviceSessionRepository,
  userNotificationRepository,
  subscribedUserRepository,
  tourPostRepository,
  marketplaceUserReposity,
} = repositories;
