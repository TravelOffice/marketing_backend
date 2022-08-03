import { telegramPlatformRepository } from '../repositories';
import { GetTelegramUserProfileUseCase } from './interfaces/GetTelegramUserProfileUseCase';

// eslint-disable-next-line max-len
export default class GetTelegramUserProfileUseCaseImpl implements GetTelegramUserProfileUseCase {
  /**
   * Get user profile information
   * @param tenantId The id of the Tenant
   * @param botId Telegram bot id
   * @param chatId The id of the conversation
   * @param userId The id of user
   * @returns User information and avatar path as object
   */
  invoke = async (
    tenantId: string,
    botId: string,
    chatId: string,
    userId: string,
  ) => telegramPlatformRepository.getUserProfile(tenantId, botId, chatId, userId);
}
