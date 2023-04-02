import {
  ChatPlatform,
  DDBConversation, ZaloReceivedMessageContent,
  ZaloPage, ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
  DDBMessage,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { ZaloConversationWithAssignee, RestrictedZaloConversation } from '../models/RestrictedZaloModels';
import { appSyncProvider, dynamoProvider, zaloMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  MESSAGE_INDEX,
  PARTITION_KEY_DELIMITER,
  TEMPORARY_MESSAGE_INDEX,
  TENANT_INDEX,
  UNKNOWN_USER,
  sendFileEvents,
  sendLinkEvents,
  sendMediaEvents,
  sendTextEvents,
} from '../utils/constants';
import logger from '../utils/logger';
import { MessageRepository } from './interfaces/MessageRepository';
import { MessageGroupType } from '../models/Message';

export default class MessageRepositoryImpl implements MessageRepository {
  private readonly getMessageType = (
    eventName: string,
    message: ZaloReceivedMessageContent,
  ): MessageGroupType => {
    if (sendTextEvents.includes(eventName)) {
      // eslint-disable-next-line no-useless-escape
      const httpRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;
      if (httpRegex.test(message.text!!)) {
        return MessageGroupType.LINK;
      }
      return MessageGroupType.TEXT;
    }
    if (sendLinkEvents.includes(eventName)) {
      return MessageGroupType.LINK;
    }
    if (sendFileEvents.includes(eventName)) {
      return MessageGroupType.FILE;
    }
    if (sendMediaEvents.includes(eventName)) {
      return MessageGroupType.MEDIA;
    }
    return MessageGroupType.OTHER;
  };

  /**
   * Send received message command to AppSync
   * @param arg The receive message command arguments
   */
  sendReceivedMessageCommand = async (
    arg: ReceiveMessageCommandArgs,
  ): Promise<ReceiveMessageCommandResponse> => appSyncProvider.sendReceivedMessageCommand(arg);

  /**
   * Save the chat message to DynamoDB
   * @param tenantId Tenant ID
   * @param platform chat platform
   * @param page the page information
   * @param customerId the customer ID
   * @param message the message which received from webhook
   * @param eventName the event name which received from webhook
   */
  saveChatMessage = async (
    tenantId: string,
    platform: ChatPlatform,
    page: ZaloPage,
    customerId: string,
    message: ZaloReceivedMessageContent,
    eventName: string,
  ) => {
    // Save the message to DynamoDB
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = platform.toUpperCase();
    const pk = `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${chatPlatformIndex}#${page.id}`;
    const sk = `${CONVERSATION_INDEX}#${customerId}#${MESSAGE_INDEX}#${message.msg_id}`;
    const lsi1 = this.getMessageType(eventName, message);
    const currentTime = Date.now();

    const conversationMessage: Omit<DDBMessage, 'pk' | 'sk'> = {
      content: message,
      lsi1,
    };

    await dynamoProvider.putItem(table, pk, sk, {
      ...conversationMessage,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    logger.log(`[MessageRepository.saveChatMessage] saved message: ${JSON.stringify({
      pk, sk, lsi1, content: message,
    }, null, 2)}`);
  };

  /**
   * Save the last chat message to DynamoDB
   * @param tenantId Tenant ID
   * @param page the page information
   * @param customerId the customer ID
   * @param message the message which received from webhook
   */
  saveConversation = async (
    tenantId: string,
    page: ZaloPage,
    customerId: string,
    message: ZaloReceivedMessageContent,
  ) => {
    // Get the current conversation information
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = ChatPlatform.zalo.toUpperCase();
    const pk = `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${chatPlatformIndex}#${page.id}`;
    const sk = `${CONVERSATION_INDEX}#${customerId}`;
    const currentTime = Date.now();
    let newConversation: RestrictedZaloConversation;
    const conversation = await dynamoProvider.getItem<DDBConversation>(table, pk, sk);

    if (conversation) {
      newConversation = {
        ...conversation,
        lastMessage: message,
      };
      // Update the last message
      await dynamoProvider.putItem(table, pk, sk, {
        ...newConversation,
        updatedAt: currentTime,
      });
      logger.log(`[MessageRepository.saveConversation] saved conversation: ${JSON.stringify({
        pk, sk, newConversation,
      }, null, 2)}`);
      const assignee = conversation.lsi1
        ? conversation.lsi1.split(PARTITION_KEY_DELIMITER)[1]
        : UNKNOWN_USER;
      return {
        ...newConversation,
        assignee,
      } as ZaloConversationWithAssignee;
    }

    // Get remote conversation
    const zaloConversation = await zaloMessagePlatformProvider.getConversation(
      page.accessToken,
      customerId,
    );
    if (!zaloConversation) {
      throw new Error(`Could not found the remote conversation of page: ${JSON.stringify(page)} and customer ${customerId}`);
    }
    // Create new conversation with unknown user
    const lsi1 = `${ASSIGNEE_INDEX}#${UNKNOWN_USER}`;
    newConversation = {
      info: zaloConversation,
      lastMessage: message,
    };
    await dynamoProvider.putItem(table, pk, sk, {
      ...newConversation,
      lsi1,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
    logger.log(`[MessageRepository.saveConversation] saved conversation: ${JSON.stringify({
      pk, sk, newConversation,
    }, null, 2)}`);
    return {
      ...newConversation,
      assignee: UNKNOWN_USER,
    } as ZaloConversationWithAssignee;
  };

  /**
   * Save the last chat message to DynamoDB
   * @param tenantId Tenant ID
   * @param page the page information
   * @param customerId the customer ID
   * @param message the message which received from webhook
   */
  getMessageMetadata = async (
    tenantId: string,
    page: ZaloPage,
    customerId: string,
    messageId: string,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const zaloPlatformStr = ChatPlatform.zalo.toUpperCase(); // Platform unique code

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${zaloPlatformStr}#${page.id}`,
      `${CONVERSATION_INDEX}#${customerId}#${TEMPORARY_MESSAGE_INDEX}#${messageId}`,
    );

    if (!item) return undefined;
    const { metadata } = item;

    return metadata;
  };
}
