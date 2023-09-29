import StoreUserSessionUseCaseImpl from './StoreUserSessionUseCaseImpl';
import { StoreUserSessionUseCase } from './interfaces/StoreUserSessionUseCase';

interface UseCases {
    storeUserSessionUseCase: StoreUserSessionUseCase,
  }

const useCases: UseCases = {
  storeUserSessionUseCase: new StoreUserSessionUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  storeUserSessionUseCase,
} = useCases;
