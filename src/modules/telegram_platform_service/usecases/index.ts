import GetTelegramConversationsUseCaseImpl from './GetTelegramConversationsUseCaseImpl';
import { GetTelegramConversationsUseCase } from './interfaces/GetTelegramConversationsUseCase';
import GetTelegramMessagesUseCaseImpl from './GetTelegramMessagesUseCaseImpl';
import { GetTelegramMessagesUseCase } from './interfaces/GetTelegramMessagesUseCase';
import SendMessageUseCaseImpl from './SendMessageUseCaseImpl';
import { SendMessageUseCase } from './interfaces/SendMessageUseCase';

interface UseCases {
  getTelegramConversationsUseCase: GetTelegramConversationsUseCase,
  getTelegramMessagesUseCase: GetTelegramMessagesUseCase,
  sendMessageUseCase: SendMessageUseCase,
}

const useCases: UseCases = {
  getTelegramConversationsUseCase: new GetTelegramConversationsUseCaseImpl(),
  getTelegramMessagesUseCase: new GetTelegramMessagesUseCaseImpl(),
  sendMessageUseCase: new SendMessageUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTelegramConversationsUseCase,
  getTelegramMessagesUseCase,
  sendMessageUseCase,
} = useCases;
