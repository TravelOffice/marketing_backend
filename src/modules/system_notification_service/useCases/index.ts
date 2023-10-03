import GetUserNotificationsUseCaseImpl from './GetUserNotificationsUseCaseImpl';
import StoreUserSessionUseCaseImpl from './StoreUserSessionUseCaseImpl';
import { GetUserNotificationsUseCase } from './interfaces/GetUserNotificationsUseCase';
import { StoreUserSessionUseCase } from './interfaces/StoreUserSessionUseCase';
import { SubscribeToTopicUseCase } from './interfaces/SubscribeToTopicUseCase';
import { UnsubscribeFromTopicUseCase } from './interfaces/UnsubscribeFromTopicUseCase';
import { SendUserNotificationsUseCase } from './interfaces/SendUserNotificationsUseCase';
import SendUserNotificationsUseCaseImpl from './SendUserNotificationsUseCaseImpl';
import SubscribeToTopicUseCaseImpl from './SubscribeToTopicUseCaseImpl';
import UnsubscribeToTopicUseCaseImpl from './UnSubscribeToTopicUseCaseImpl';

interface UseCases {
  storeUserSessionUseCase: StoreUserSessionUseCase,
  getUserNotificationsUseCase: GetUserNotificationsUseCase,
  sendUserNotificationUserCase: SendUserNotificationsUseCase,
  subscribeToTopicUseCase: SubscribeToTopicUseCase,
  unsubScribeFromTopicUseCase: UnsubscribeFromTopicUseCase,
}

const useCases: UseCases = {
  storeUserSessionUseCase: new StoreUserSessionUseCaseImpl(),
  getUserNotificationsUseCase: new GetUserNotificationsUseCaseImpl(),
  sendUserNotificationUserCase: new SendUserNotificationsUseCaseImpl(),
  subscribeToTopicUseCase: new SubscribeToTopicUseCaseImpl(),
  unsubScribeFromTopicUseCase: new UnsubscribeToTopicUseCaseImpl(),
};

export const {
  storeUserSessionUseCase,
  getUserNotificationsUseCase,
  sendUserNotificationUserCase,
  subscribeToTopicUseCase,
  unsubScribeFromTopicUseCase,
} = useCases;
