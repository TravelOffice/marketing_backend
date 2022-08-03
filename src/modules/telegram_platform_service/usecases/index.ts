import GetTelegramConversationsUseCaseImpl from './GetTelegramConversationsUseCaseImpl';
import { GetTelegramConversationsUseCase } from './interfaces/GetTelegramConversationsUseCase';
import GetTelegramMessagesUseCaseImpl from './GetTelegramMessagesUseCaseImpl';
import { GetTelegramMessagesUseCase } from './interfaces/GetTelegramMessagesUseCase';
import SendMessageUseCaseImpl from './SendMessageUseCaseImpl';
import { SendMessageUseCase } from './interfaces/SendMessageUseCase';
import GetFileInfoUseCaseImpl from './GetFileInfoUseCaseImpl';
import { GetFileInfoUseCase } from './interfaces/GetFileInfoUseCase';
import { AdminGetTelegramConversationsUseCase } from './interfaces/AdminGetTelegramConversationsUseCase';
import AdminGetTelegramConversationsUseCaseImpl from './AdminGetTelegramConversationsUseCaseImpl';
import GetUserProfileUseCaseImpl from './GetTelegramUserProfileUseCaseImpl';
import { GetTelegramUserProfileUseCase } from './interfaces/GetTelegramUserProfileUseCase';

interface UseCases {
  getTelegramConversationsUseCase: GetTelegramConversationsUseCase,
  getTelegramMessagesUseCase: GetTelegramMessagesUseCase,
  sendMessageUseCase: SendMessageUseCase,
  getFileInfoUseCase: GetFileInfoUseCase,
  adminGetTelegramConversationsUseCase: AdminGetTelegramConversationsUseCase,
  getTelegramUserProfileUseCase: GetTelegramUserProfileUseCase,
}

const useCases: UseCases = {
  getTelegramConversationsUseCase: new GetTelegramConversationsUseCaseImpl(),
  getTelegramMessagesUseCase: new GetTelegramMessagesUseCaseImpl(),
  sendMessageUseCase: new SendMessageUseCaseImpl(),
  getFileInfoUseCase: new GetFileInfoUseCaseImpl(),
  adminGetTelegramConversationsUseCase: new AdminGetTelegramConversationsUseCaseImpl(),
  getTelegramUserProfileUseCase: new GetUserProfileUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  getTelegramConversationsUseCase,
  getTelegramMessagesUseCase,
  sendMessageUseCase,
  getFileInfoUseCase,
  adminGetTelegramConversationsUseCase,
  getTelegramUserProfileUseCase,
} = useCases;
