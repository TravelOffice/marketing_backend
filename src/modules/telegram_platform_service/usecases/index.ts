import GetTelegramConversationsUseCaseImpl from './GetTelegramConversationsUseCaseImpl';
import { GetTelegramConversationsUseCase } from './interfaces/GetTelegramConversationsUseCase';
import GetTelegramMessagesUseCaseImpl from './GetTelegramMessagesUseCaseImpl';
import { GetTelegramMessagesUseCase } from './interfaces/GetTelegramMessagesUseCase';

interface UseCases {
  getTelegramConversationsUseCase: GetTelegramConversationsUseCase,
  getTelegramMessagesUseCase: GetTelegramMessagesUseCase,
}

const useCases: UseCases = {
  getTelegramConversationsUseCase: new GetTelegramConversationsUseCaseImpl(),
  getTelegramMessagesUseCase: new GetTelegramMessagesUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTelegramConversationsUseCase,
  getTelegramMessagesUseCase,
} = useCases;
