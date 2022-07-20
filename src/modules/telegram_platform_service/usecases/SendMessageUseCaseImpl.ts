import {
  ChatPlatform, SendMessageData,
} from 'common-models';
import { messageRepository, telegramPlatformRepository } from '../repositories';
import { SendMessageUseCase } from './interfaces/SendMessageUseCase';

export default class SendMessageUseCaseImpl implements SendMessageUseCase {
  /**
   * Send text message from Telegram Bot
   * - Step 1: Get telegram bot token
   * - Step 2: Send message by Telegram bot
   * - Step 3: Save the chat messabge to dynamo DB
   * - Step 4: Save the last message to conversation
   * @param tenantId Tenant identifier
   * @param botId Telegram bot id
   * @param chatId Telegram chat id
   * @param text Content of message
   * @param options Optional options
   * @returns Telegram Message object
   */
  invoke = async (
    tenantId: string,
    botId: string,
    chatId: string,
    messageData: SendMessageData,
  ) => {
    // Get Telegram Bot token
    const accessToken = await telegramPlatformRepository.getAccessToken(tenantId, botId);

    let sentMessage;
    if (messageData.text) {
      // Send text message by Telegram bot
      sentMessage = await telegramPlatformRepository.sendTextMessage(
        accessToken,
        chatId,
        messageData.text,
        messageData.options,
      );
    } else if (messageData.photo) {
      // Send photo message by Telegram bot
      sentMessage = await telegramPlatformRepository.sendPhotoMessage(
        accessToken,
        chatId,
        messageData.photo,
        messageData.options,
      );
    } else if (messageData.doc) {
      // Send document message by Telegram bot
      sentMessage = await telegramPlatformRepository.sendDocumentMessage(
        accessToken,
        chatId,
        messageData.doc,
        messageData.options,
        messageData.fileOptions,
      );
    } else {
      throw new Error('[SendMessageUseCase.invoke] This message type isn\'t supported');
    }

    const platform = ChatPlatform.telegram;

    // Send received message command to AppSync
    await messageRepository.sendReceivedMessageCommand(platform, { ...sentMessage });

    // Save the chat message to dynamo DB
    await messageRepository.saveChatMessage(tenantId, platform, botId, sentMessage);

    // Save the last message to conversation
    await messageRepository.saveConversation(tenantId, platform, botId, sentMessage);

    return sentMessage;
  };
}
