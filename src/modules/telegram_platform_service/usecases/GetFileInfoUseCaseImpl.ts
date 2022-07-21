import { telegramPlatformRepository } from '../repositories';
import { GetFileInfoUseCase } from './interfaces/GetFileInfoUseCase';

export default class GetFileInfoUseCaseImpl implements GetFileInfoUseCase {
  /**
   * Get the file information from telegram
   * - Step 1: Get telegram bot token
   * - Step 2: Get the file information
   * @param tenantId Tenant identifier
   * @param botId Telegram bot id
   * @param chatId Telegram chat id
   * @param fileId The telegram file id
   * @returns Telegram File object
   */
  invoke = async (
    tenantId: string,
    botId: string,
    chatId: string,
    fileId: string,
  ) => {
    // Get Telegram bot token
    const accessToken = await telegramPlatformRepository.getAccessToken(botId);

    // Get telegram file
    return telegramPlatformRepository.getFileInfo(tenantId, accessToken, chatId, fileId);
  };
}
