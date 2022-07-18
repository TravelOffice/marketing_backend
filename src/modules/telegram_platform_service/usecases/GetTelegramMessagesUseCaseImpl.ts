import { TelegramPagingMessage } from '../models';
import { telegramPlatformRepository, userRepository } from '../repositories';
import logger from '../utils/logger';
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
  ) => {
    const isRootOrAdmin = await userRepository.isRootOrAdmin(tenantId, assigneeId);
    const conversation = await telegramPlatformRepository.getChat(tenantId, botId, chatId);

    if (!isRootOrAdmin && conversation.assignee !== assigneeId) {
      logger.log(`User [${assigneeId}] not have permission to get conversation [${chatId}]!`);
      return {
        messages: [],
      } as TelegramPagingMessage;
    }
    return telegramPlatformRepository.getConversationMessages(
      tenantId,
      botId,
      chatId,
      nextToken,
      limit,
    );
  };
}
