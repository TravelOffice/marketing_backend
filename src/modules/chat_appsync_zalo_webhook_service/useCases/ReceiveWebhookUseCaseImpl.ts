import { saleAssignmentRepository } from 'auto-assign-utilities';
import {
  ChatPlatform,
  ZaloWebhookMessageEvent,
  ReceiveMessageCommandArgs,
} from 'common-models';
import { messageRepository, pageRepository } from '../repositories';
import {
  anonymousSendDataEvents, oaSendDataEvents, UNKNOWN_USER, userSendDataEvents,
} from '../utils/constants';
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
    webhookEvent: ZaloWebhookMessageEvent,
  ) => {
    const sender = webhookEvent.sender.id;
    const recipient = webhookEvent.recipient.id;
    const { message, event_name: eventName } = webhookEvent;
    let pageId: string;
    let customerId: string;
    const chatPlatform = ChatPlatform.zalo;

    if (userSendDataEvents.includes(eventName) || anonymousSendDataEvents.includes(eventName)) {
      pageId = recipient;
      customerId = sender;
    } else {
      pageId = sender;
      customerId = recipient;
    }
    message.time = parseInt(webhookEvent.timestamp, 10);
    message.from_id = sender;
    message.to_id = recipient;

    // Get the linked page information
    const page = await pageRepository.get(pageId);
    if (!page) {
      throw new Error('This page is not linked yet!');
    }

    // Save the chat message
    await messageRepository.saveChatMessage(
      page.tenantId,
      chatPlatform,
      page,
      customerId,
      message,
      eventName,
    );

    if (oaSendDataEvents.includes(eventName)) {
      // Get the metadata of the message
      const metadata = await messageRepository.getMessageMetadata(
        page.tenantId,
        page,
        customerId,
        message.msg_id,
      );
      message.metadata = metadata;
    }

    // Save the last message to conversation
    const conversation = await messageRepository.saveConversation(
      page.tenantId,
      page,
      customerId,
      message,
    );

    // Delete mid attribute, mid will be appeared in ReceiveMessageCommandArgs
    const { msg_id: messageId, ...messageData } = message;
    const assignee = conversation.assignee ?? UNKNOWN_USER;
    const commandArgs: ReceiveMessageCommandArgs = {
      id: messageId,
      sender,
      recipient,
      customerId,
      username: assignee,
      tenant: page.tenantId,
      timestamp: message.time,
      messageData: JSON.stringify(messageData),
      chatPlatform,
    };

    // Send received message command to AppSync
    await messageRepository.sendReceivedMessageCommand(commandArgs);

    if (assignee === UNKNOWN_USER) {
      logger.log(`Conversation ${conversation.info.id} is unassigned, continue process auto assignment`);
      // Send to SQS message to process auto assignment
      // Send to SQS message to process auto assignment
      await saleAssignmentRepository.notifyNewIncomingConversation({
        tenant: page.tenantId,
        pageId: page.id,
        chatPlatform,
        conversationId: customerId,
      });
    }
  };
}
