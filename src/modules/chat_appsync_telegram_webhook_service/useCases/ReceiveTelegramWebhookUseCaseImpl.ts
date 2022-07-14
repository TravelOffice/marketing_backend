import {
  ChatPlatform, TelegramWebhookMessageEvent,
} from 'common-models';
import { messageRepository, pageRepository } from '../repositories';
import { ReceiveTelegramWebhookUseCase } from './interfaces/ReceiveTelegramWebhookUseCase';

export default class ReceiveTelegramWebhookUseCaseImpl implements ReceiveTelegramWebhookUseCase {
  /**
   * Method to process receive telegram webhook event
   * There are steps need to do:
   * - Step 1: Confirm the type of webhook event
   * - Step 2: Check whether the source of message is bot or not
   * - Step 3: Send received message command to AppSync
   * - Step 4: Save the chat message to DynamoDB
   * - Step 5: Save the last message to DynamoDB
   * @param webhookEvent The telegram received webhook event
   * @param tenantId The tenant ID
   */
  invoke = async (webhookEvent: TelegramWebhookMessageEvent, tenantId: string) => {
    // Get message payload
    const { message } = webhookEvent;
    const platform = ChatPlatform.telegram;

    // TODO: Other type of webhook event will be supported later. Now only supported message event
    if (!message) {
      throw new Error('Now only supported message webhook event');
    }

    // Confirm the source of the message
    if (message.from?.is_bot) {
      throw new Error('Only non-bot commands are supported');
    }

    // Send received message command to AppSync
    await messageRepository.sendReceivedMessageCommand(tenantId, platform, { ...message });

    // Get the linked page information
    const page = await pageRepository.get(tenantId, platform);
    if (!page) {
      throw new Error('This page is not linked yet!');
    }

    // Save the chat message
    await messageRepository.saveChatMessage(tenantId, platform, page, message);

    // Save the last message to conversation
    await messageRepository.saveConversation(tenantId, platform, page, message);
  };
}
