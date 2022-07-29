import {
  ChatPlatform, FacebookWebhookMessageEvent, ReceiveMessageCommandArgs,
} from 'common-models';
import { messageRepository, pageRepository } from '../repositories';
import { UNKNOWN_USER } from '../utils/constants';
import { ReceiveWebhookUseCase } from './interfaces/ReceiveWebhookUseCase';

export default class ReceiveWebhookUseCaseImpl implements ReceiveWebhookUseCase {
  /**
   * Method to process receive Facebook webhook event
   * There are steps need to do:
   * - Step 1: Save the last message to DynamoDB
   * - Step 2: Send received message command to AppSync
   * @param webhookEvent The facebook received webhook event
   */
  invoke = async (
    webhookEvent: FacebookWebhookMessageEvent,
  ) => {
    const sender = webhookEvent.sender.id;
    const recipient = webhookEvent.recipient.id;
    const { message } = webhookEvent;
    /** Identify page id.
     * If is_echo === true => message is sent by Facebook page,
     *  otherwise message is sent by customer
     * References https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/message-echoes
    */
    const pageId = message.is_echo ? sender : recipient;
    const customerId = message.is_echo ? recipient : sender;

    // Get the linked page information
    const page = await pageRepository.get(pageId);
    if (!page) {
      throw new Error('This page is not linked yet!');
    }

    // Save the last message to conversation
    const conversation = await messageRepository.saveConversation(
      page.tenantId,
      page,
      customerId,
      message,
    );

    // Delete mid attribute, mid will be appeared in ReceiveMessageCommandArgs
    const { mid: messageId, ...messageData } = message;
    const commandArgs: ReceiveMessageCommandArgs = {
      id: messageId,
      sender,
      recipient,
      customerId,
      username: conversation.assignee ?? UNKNOWN_USER,
      tenant: page.tenantId,
      timestamp: webhookEvent.timestamp,
      messageData: JSON.stringify(messageData),
      chatPlatform: ChatPlatform.facebook,
    };

    // Send received message command to AppSync
    await messageRepository.sendReceivedMessageCommand(commandArgs);
  };
}
