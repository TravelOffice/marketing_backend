import GetMarketplaceNotificationsUseCaseImpl from './GetUserNotificationsUseCaseImpl';
import StoreUserSessionUseCaseImpl from './StoreUserSessionUseCaseImpl';
import { GetUserNotificationsUseCase } from './interfaces/GetUserNotificationsUseCase';
import { StoreUserSessionUseCase } from './interfaces/StoreUserSessionUseCase';
import { SubscribeToTopicUseCase } from './interfaces/SubscribeToTopicUseCase';
import { UnsubscribeFromTopicUseCase } from './interfaces/UnsubscribeFromTopicUseCase';
import { SendUserNotificationsUseCase } from './interfaces/SendUserNotificationsUseCase';
import SendUserNotificationsUseCaseImpl from './SendUserNotificationsUseCaseImpl';
import SubscribeToTopicUseCaseImpl from './SubscribeToTopicUseCaseImpl';
import UnsubscribeToTopicUseCaseImpl from './UnSubscribeToTopicUseCaseImpl';
import { MarkNotificationAsReadUseCase } from './interfaces/MarkNotificationAsReadUseCase';
import MarkNotificationAsReadUseCaseImpl from './MarkNotificationAsReadUseCaseImpl';
import MarkAllNotificationsAsReadUseCaseImpl from './MarkAllNotificationsAsReadUseCaseImpl';
import { MarkAllNotificationsAsReadUseCase } from './interfaces/MarkAllNotificationsAsReadUseCase';

interface UseCases {
  storeUserSessionUseCase: StoreUserSessionUseCase,
  getUserNotificationsUseCase: GetUserNotificationsUseCase,
  sendUserNotificationUserCase: SendUserNotificationsUseCase,
  subscribeToTopicUseCase: SubscribeToTopicUseCase,
  unsubScribeFromTopicUseCase: UnsubscribeFromTopicUseCase,
  markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
  markAllNotificationsAsReadUseCase: MarkAllNotificationsAsReadUseCase,
}

const useCases: UseCases = {
  storeUserSessionUseCase: new StoreUserSessionUseCaseImpl(),
  getUserNotificationsUseCase: new GetMarketplaceNotificationsUseCaseImpl(),
  sendUserNotificationUserCase: new SendUserNotificationsUseCaseImpl(),
  subscribeToTopicUseCase: new SubscribeToTopicUseCaseImpl(),
  unsubScribeFromTopicUseCase: new UnsubscribeToTopicUseCaseImpl(),
  markNotificationAsReadUseCase: new MarkNotificationAsReadUseCaseImpl(),
  markAllNotificationsAsReadUseCase: new MarkAllNotificationsAsReadUseCaseImpl(),
};

export const {
  storeUserSessionUseCase,
  getUserNotificationsUseCase,
  sendUserNotificationUserCase,
  subscribeToTopicUseCase,
  unsubScribeFromTopicUseCase,
  markNotificationAsReadUseCase,
  markAllNotificationsAsReadUseCase,
} = useCases;
