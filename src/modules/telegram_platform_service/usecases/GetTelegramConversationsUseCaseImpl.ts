import { telegramPlatformRepository } from '../repositories';
import { GetTelegramConversationsUseCase } from './interfaces/GetTelegramConversationsUseCase';

// eslint-disable-next-line max-len
export default class GetTelegramConversationsUseCaseImpl implements GetTelegramConversationsUseCase {
  /**
   * Get telegram conversations for given assignee
   * Conversations are stored at DynamoDB chat table
   * @param tenantId Tenant identifier
   * @param botId Telegram bot id
   * @param assigneeId Employee id assigned to conversations
   */
  invoke = async (
    tenantId: string,
    botId: string,
    assigneeId: string,
  ) => telegramPlatformRepository.getConversations(tenantId, botId, assigneeId);
}
