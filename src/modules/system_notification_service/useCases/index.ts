import GetUserNotificationsUseCaseImpl from './GetUserNotificationsUseCaseImpl';
import StoreUserSessionUseCaseImpl from './StoreUserSessionUseCaseImpl';
import { GetUserNotificationsUseCase } from './interfaces/GetUserNotificationsUseCase';
import { StoreUserSessionUseCase } from './interfaces/StoreUserSessionUseCase';

interface UseCases {
  storeUserSessionUseCase: StoreUserSessionUseCase,
  getUserNotificationsUseCase: GetUserNotificationsUseCase,
}

const useCases: UseCases = {
  storeUserSessionUseCase: new StoreUserSessionUseCaseImpl(),
  getUserNotificationsUseCase: new GetUserNotificationsUseCaseImpl(),
};

export const {
  storeUserSessionUseCase,
  getUserNotificationsUseCase,
} = useCases;
