import { saleAssignmentRepository } from 'auto-assign-utilities';
import {
  ChatPlatform,
  FacebookWebhookMessageEvent,
  ReceiveMessageCommandArgs,
} from 'common-models';
import { messageRepository, pageRepository } from '../repositories';
import { UNKNOWN_USER } from '../utils/constants';
import { ReceiveWebhookUseCase } from './interfaces/ReceiveWebhookUseCase';
import logger from '../utils/logger';

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

    // Get conversaiton infor
    const fbConversation = await messageRepository.getConversationInfo(page, customerId);

    // Get message information
    const fbMessage = await messageRepository.getMessageInfo(page, message.mid);

    // Save the chat message
    const savedMessage = await messageRepository.saveChatMessage(
      page.tenantId,
      ChatPlatform.facebook,
      page,
      fbConversation.id,
      fbMessage,
    );

    // Save the last message to conversation
    const conversation = await messageRepository.saveConversation(
      page.tenantId,
      page,
      fbMessage,
      fbConversation,
    );

    // Delete mid attribute, mid will be appeared in ReceiveMessageCommandArgs
    const { mid: messageId, ...messageData } = message;
    const assignee = conversation.assignee ?? UNKNOWN_USER;
    const commandArgs: ReceiveMessageCommandArgs = {
      id: messageId,
      sender,
      recipient,
      customerId,
      username: assignee,
      tenant: page.tenantId,
      timestamp: webhookEvent.timestamp,
      messageData: JSON.stringify(messageData),
      chatPlatform: ChatPlatform.facebook,
    };

    // Send received message command to AppSync
    await messageRepository.sendReceivedMessageCommand(commandArgs);

    if (assignee === UNKNOWN_USER) {
      logger.log(`Conversation ${conversation.info.id} is unassigned, continue process auto assignment`);
      // Send to SQS message to process auto assignment
      const { createdAt: lastMessageSentAt = Date.now() } = savedMessage;
      await saleAssignmentRepository.notifyNewIncomingConversation({
        tenant: page.tenantId,
        pageId: page.id,
        chatPlatform: page.platform,
        conversationId: conversation.info.id.toString(),
        lastMessageSentAt: lastMessageSentAt.toString(),
      });
    } else {
      logger.log(`Conversation ${conversation.info.id} is assigned to ${conversation.assignee}, skip process auto assignment`);
    }
  };
}
