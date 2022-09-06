import { telegramPlatformRepository } from '../repositories';
import { GetTelegramMessagesUseCase } from './interfaces/GetTelegramMessagesUseCase';

// eslint-disable-next-line max-len
export default class GetTelegramMessagesUseCaseImpl implements GetTelegramMessagesUseCase {
  /**
   * Get telegram Messages for given assignee
   * Messages are stored at DynamoDB chat table
   * @param tenantId Tenant identifier
   * @param botId Telegram bot id
   * @param assigneeId Employee id assigned to Messages
   */
  invoke = async (
    tenantId: string,
    assigneeId: string,
    botId: string,
    chatId: string,
    nextToken?: string,
    limit?: number,
  ) => telegramPlatformRepository.getConversationMessages(
    tenantId,
    botId,
    chatId,
    nextToken,
    limit,
  );
}
