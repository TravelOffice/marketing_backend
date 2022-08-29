import {
  ChatPlatform, DDBConversation, DDBMessage, MessageEntity, ReceiveMessageCommandArgs,
  TelegramBot, TelegramMessageContent,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { MessageGroupType } from '../models/Message';
import { RestrictedTelegramConversation, TelegramConversationWithAssignee } from '../models/RestrictedTelegramModels';
import { appSyncProvider, dynamoProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX, MESSAGE_INDEX, PARTITION_KEY_DELIMITER, TENANT_INDEX, UNKNOWN_USER,
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
   * @param username Tenant user ID
   * @param platform chat platform
   * @param message The chat message
   */
  sendReceivedMessageCommand = async (
    tenantId: string,
    username: string,
    platform: ChatPlatform,
    message: TelegramMessageContent,
  ): Promise<void> => {
    // Delete message_id attribute, mid will be appeared in ReceiveMessageCommandArgs
    const { message_id: messageId, ...messageData } = message;
    const sender = message.chat.id.toString() || message.chat.username || '';
    const commandArgs: ReceiveMessageCommandArgs = {
      id: messageId.toString(),
      sender,
      recipient: tenantId,
      customerId: sender,
      timestamp: message.date,
      messageData: JSON.stringify(messageData),
      chatPlatform: platform,
      username,
      tenant: tenantId,
    };

    // Send the message command to AppSync
    await appSyncProvider.sendReceivedMessageCommand(commandArgs);
  };

  /**
   * Save the chat message to DynamoDB
   * @param tenantId Tenant ID
   * @param platform chat platform
   * @param page the page information
   * @param message the message which received from webhook
   */
  saveChatMessage = async (
    tenantId: string,
    platform: ChatPlatform,
    page: TelegramBot,
    message: TelegramMessageContent,
  ) => {
    // Save the message to DynamoDB
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = platform.toUpperCase();
    const pk = `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${chatPlatformIndex}#${page.id}`;
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
   * @param page the page information
   * @param message the message which received from webhook
   */
  saveConversation = async (
    tenantId: string,
    platform: ChatPlatform,
    page: TelegramBot,
    message: TelegramMessageContent,
  ) => {
    // Get the current conversation information
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = platform.toUpperCase();
    const conversationId = message.chat.id;
    const pk = `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${chatPlatformIndex}#${page.id}`;
    const sk = `${CONVERSATION_INDEX}#${conversationId}`;
    const currentTime = Date.now();
    let newConversation: RestrictedTelegramConversation;

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
      const assignee = conversation.typeLsi
        ? conversation.typeLsi.split(PARTITION_KEY_DELIMITER)[1]
        : UNKNOWN_USER;
      return {
        ...newConversation,
        assignee,
      } as TelegramConversationWithAssignee;
    }
    // Create new conversation with unknown user
    const typeLsi = `${ASSIGNEE_INDEX}#${UNKNOWN_USER}`;
    newConversation = {
      info: message.chat,
      lastMessage: message,
    };
    await dynamoProvider.putItem(table, pk, sk, {
      ...newConversation,
      typeLsi,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
    logger.log(`[MessageRepository.saveConversation] saved conversation: ${JSON.stringify({
      pk, sk, newConversation,
    }, null, 2)}`);
    return {
      ...newConversation,
      assignee: UNKNOWN_USER,
    } as TelegramConversationWithAssignee;
  };
}
