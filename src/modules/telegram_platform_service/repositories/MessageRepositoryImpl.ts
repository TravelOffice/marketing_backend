import {
  ChatPlatform,
  DDBConversation,
  DDBMessage,
  MessageEntity,
  ReceiveMessageCommandArgs,
  TelegramMessageContent,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { MessageGroupType } from '../models/Message';
import { appsyncProvider, dynamoProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX, MESSAGE_INDEX, TENANT_INDEX, UNKNOWN_USER,
} from '../utils/constants';
import logger from '../utils/logger';
import { MessageRepository } from './interfaces/MessageRepository';

export default class MessageRepositoryImpl implements MessageRepository {
  private readonly getMessageType = (message: TelegramMessageContent): MessageGroupType => {
    if (message.text) {
      const messageEntities = message.entities;
      if (messageEntities
        && messageEntities.length > 0
        && messageEntities.some((entity: MessageEntity) => entity.type === 'url')) {
        return MessageGroupType.LINK;
      }
      return MessageGroupType.TEXT;
    }
    if (message.audio || message.video || message.voice || message.photo) {
      return MessageGroupType.MEDIA;
    }
    if (message.document) {
      return MessageGroupType.FILE;
    }
    return MessageGroupType.OTHER;
  };

  /**
   * Send received message command to AppSync
   * @param tenantId Tenant ID
   * @param platform chat platform
   * @param message The chat message
   */
  sendReceivedMessageCommand = async (
    platform: ChatPlatform,
    message: TelegramMessageContent,
  ): Promise<void> => {
    // Delete message_id attribute, mid will be appeared in ReceiveMessageCommandArgs
    const { message_id: messageId, ...messageData } = message;
    const sender = message.from?.id.toString() || '';
    const customerId = message.chat.username || `${message.chat.id}` || '';
    const recipient = customerId;

    const commandArgs: ReceiveMessageCommandArgs = {
      id: messageId.toString(),
      sender,
      recipient,
      customerId,
      timestamp: message.date,
      messageData: JSON.stringify(messageData),
      chatPlatform: platform,
    };

    // Send the message command to AppSync
    await appsyncProvider.sendReceivedMessageCommand(commandArgs);
  };

  /**
   * Save the chat message to DynamoDB
   * @param tenantId Tenant ID
   * @param platform chat platform
   * @param pageId Id of the page
   * @param message the message which received from webhook
   */
  saveChatMessage = async (
    tenantId: string,
    platform: ChatPlatform,
    pageId: string,
    message: TelegramMessageContent,
  ) => {
    // Save the message to DynamoDB
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = platform.toUpperCase();
    const pk = `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${chatPlatformIndex}#${pageId}`;
    const sk = `${CONVERSATION_INDEX}#${message.chat.id}#${MESSAGE_INDEX}#${message.message_id}`;
    const typeLsi = this.getMessageType(message);
    const currentTime = Date.now();

    const conversationMessage: Omit<DDBMessage, 'pk' | 'sk'> = {
      content: message,
      typeLsi,
    };

    await dynamoProvider.putItem(table, pk, sk, {
      ...conversationMessage,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    logger.log(`[MessageRepository.saveChatMessage] saved message: ${JSON.stringify({
      pk, sk, typeLsi, content: message,
    }, null, 2)}`);
  };

  /**
   * Save the last chat message to DynamoDB
   * @param tenantId Tenant ID
   * @param platform chat platform
   * @param pageId ID of the page
   * @param message the message which received from webhook
   */
  saveConversation = async (
    tenantId: string,
    platform: ChatPlatform,
    pageId: string,
    message: TelegramMessageContent,
  ) => {
    // Get the current conversation information
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = platform.toUpperCase();
    const conversationId = message.chat.id;
    const pk = `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${chatPlatformIndex}#${pageId}`;
    const sk = `${CONVERSATION_INDEX}#${conversationId}`;
    const currentTime = Date.now();

    const conversation = await dynamoProvider.getItem<DDBConversation>(table, pk, sk);
    if (conversation) {
      // Update the last message
      await dynamoProvider.putItem(table, pk, sk, {
        ...conversation,
        lastMessage: message,
        updatedAt: currentTime,
      });
    } else {
      // Create new conversation with unknown user
      const typeLsi = `${ASSIGNEE_INDEX}#${UNKNOWN_USER}`;
      const newConversation: Omit<DDBConversation, 'pk' | 'sk'> = {
        info: message.chat,
        lastMessage: message,
        typeLsi,
      };
      await dynamoProvider.putItem(table, pk, sk, {
        ...newConversation,
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    }

    logger.log(`[MessageRepository.saveLastMessage] saved message: ${JSON.stringify({
      pk, sk, lastMessage: message,
    }, null, 2)}`);
  };
}
