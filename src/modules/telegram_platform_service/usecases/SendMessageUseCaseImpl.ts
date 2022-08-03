import { ChatPlatform } from 'common-models';
import { TelegramSendMessageData } from '../models/send-message/SendMessageData';
import { messageRepository, telegramPlatformRepository } from '../repositories';
import { SendMessageUseCase } from './interfaces/SendMessageUseCase';

export default class SendMessageUseCaseImpl implements SendMessageUseCase {
  /**
   * Send text message from Telegram Bot
   * - Step 1: Get telegram bot token
   * - Step 2: Send message by Telegram bot
   * - Step 3: Save the chat message to dynamo DB
   * - Step 4: Save the last message to conversation
   * @param tenantId Tenant identifier
   * @param username Tenant user identifier
   * @param botId Telegram bot id
   * @param chatId Telegram chat id
   * @param text Content of message
   * @param options Optional options
   * @returns Telegram Message object
   */
  invoke = async (
    tenantId: string,
    username: string,
    botId: string,
    chatId: string,
    data: TelegramSendMessageData,
  ) => {
    // Get Telegram Bot token
    const accessToken = await telegramPlatformRepository.getAccessToken(botId);

    // Send message by Telegram bot
    const sentMessage = await telegramPlatformRepository.sendMessage(
      accessToken,
      chatId,
      data,
    );

    const platform = ChatPlatform.telegram;

    // Send received message command to AppSync
    await messageRepository.sendReceivedMessageCommand(
      platform,
      tenantId,
      username,
      { ...sentMessage },
    );

    // Save the chat message to dynamo DB
    await messageRepository.saveChatMessage(tenantId, platform, botId, sentMessage);

    // Save the last message to conversation
    await messageRepository.saveConversation(tenantId, platform, botId, sentMessage);

    return sentMessage;
  };
}
