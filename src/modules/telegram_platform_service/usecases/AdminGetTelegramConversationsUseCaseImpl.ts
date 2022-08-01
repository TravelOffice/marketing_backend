import { telegramPlatformRepository } from '../repositories';
import { AdminGetTelegramConversationsUseCase } from './interfaces/AdminGetTelegramConversationsUseCase';

// eslint-disable-next-line max-len
export default class AdminGetTelegramConversationsUseCaseImpl implements AdminGetTelegramConversationsUseCase {
  /**
   * Get telegram conversations for given assignee
   * Conversations are stored at DynamoDB chat table
   * @param tenantId Tenant identifier
   * @param botId Telegram bot id
   */
  invoke = async (
    tenantId: string,
    botId: string,
  ) => telegramPlatformRepository.getConversations(tenantId, botId);
}
