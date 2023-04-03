import {
  ChatPlatform,
  DDBConversation, DDBMessage, FacebookConversation, FacebookMessage,
  FacebookPage, ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { MessageGroupType } from '../models/Facebook';
import { FacebookConversationWithAssignee, RestrictedFacebookConversation } from '../models/RestrictedFacebookModels';
import { appSyncProvider, dynamoProvider, fbMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX, MESSAGE_INDEX, PARTITION_KEY_DELIMITER, TENANT_INDEX,
  UNKNOWN_USER,
} from '../utils/constants';
import logger from '../utils/logger';
import { MessageRepository } from './interfaces/MessageRepository';

export default class MessageRepositoryImpl implements MessageRepository {
  /**
   * Get facebook message type
   * @param message The message was received from Facebook Graph API
   * @returns MessageGroupType
   */
  private readonly getMessageType = (message: FacebookMessage): MessageGroupType => {
    if ('text' in message) {
      return MessageGroupType.TEXT;
    }
    if ('attachments' in message && message.attachments?.data.length) {
      const messageType = message.attachments.data[0].mime_type;
      if (messageType.startsWith('file')) {
        return MessageGroupType.FILE;
      }
      if (messageType.startsWith('audio') || messageType.startsWith('video') || messageType.startsWith('image')) {
        return MessageGroupType.MEDIA;
      }
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
     * @param fbConversationId the conversation id
     * @param message the message which received from webhook
=     */
  saveChatMessage = async (
    tenantId: string,
    platform: ChatPlatform,
    page: FacebookPage,
    fbConversationId: string,
    message: FacebookMessage,
  ) => {
    // Save the message to DynamoDB
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = platform.toUpperCase();
    const pk = `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${chatPlatformIndex}#${page.id}`;
    const sk = `${CONVERSATION_INDEX}#${fbConversationId}#${MESSAGE_INDEX}#${message.id}`;
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

  getConversationInfo = async (
    page: FacebookPage,
    customerId: string,
  ): Promise<FacebookConversation> => {
    // Get remote conversation
    const fbConversation = await fbMessagePlatformProvider.getConversation(
      page.accessToken,
      page.id,
      customerId,
    );
    if (!fbConversation) {
      throw new Error(`Could not found the remote conversation of page: ${JSON.stringify(page)} and customer ${customerId}`);
    }
    return fbConversation;
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
    page: FacebookPage,
    message: FacebookMessage,
    fbConversation: FacebookConversation,
  ) => {
    // Get the current conversation information
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = ChatPlatform.facebook.toUpperCase();
    const pk = `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${chatPlatformIndex}#${page.id}`;
    const sk = `${CONVERSATION_INDEX}#${fbConversation.id}`;
    const currentTime = Date.now();
    let newConversation: RestrictedFacebookConversation;
    const conversation = await dynamoProvider.getItem<DDBConversation>(table, pk, sk);

    if (conversation) {
      newConversation = {
        ...conversation,
        info: fbConversation,
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
      } as FacebookConversationWithAssignee;
    }

    // Create new conversation with unknown user
    const typeLsi = `${ASSIGNEE_INDEX}#${UNKNOWN_USER}`;
    newConversation = {
      info: fbConversation,
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
    } as FacebookConversationWithAssignee;
  };

  /**
   * Get message information by Facebook Graph API
   * @param page FacebookPage object
   * @param messageId ID of the message
   * @returns
   */
  getMessageInfo = async (
    page: FacebookPage,
    messageId: string,
  ): Promise<FacebookMessage> => {
    // Get remote conversation
    const fbMessage = await fbMessagePlatformProvider.getMessage(
      page.accessToken,
      messageId,
    );
    if (!fbMessage) {
      throw new Error(`Could not found the message with the ID: ${messageId}`);
    }
    return fbMessage;
  };
}
