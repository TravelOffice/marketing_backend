import GetTelegramConversationsUseCaseImpl from './GetTelegramConversationsUseCaseImpl';
import { GetTelegramConversationsUseCase } from './interfaces/GetTelegramConversationsUseCase';

interface UseCases {
  getTelegramConversationsUseCase: GetTelegramConversationsUseCase,
}

const useCases: UseCases = {
  getTelegramConversationsUseCase: new GetTelegramConversationsUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTelegramConversationsUseCase,
} = useCases;
