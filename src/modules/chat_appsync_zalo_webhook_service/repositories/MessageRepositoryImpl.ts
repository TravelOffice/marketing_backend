import {
  ChatPlatform,
  DDBConversation, ZaloReceivedMessageContent,
  ZaloPage, ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { ZaloConversationWithAssignee, RestrictedZaloConversation } from '../models/RestrictedZaloModels';
import { appSyncProvider, dynamoProvider, zaloMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  PARTITION_KEY_DELIMITER,
  TEMPORARY_MESSAGE_INDEX,
  TENANT_INDEX,
  UNKNOWN_USER,
} from '../utils/constants';
import logger from '../utils/logger';
import { MessageRepository } from './interfaces/MessageRepository';

export default class MessageRepositoryImpl implements MessageRepository {
  /**
   * Send received message command to AppSync
   * @param arg The receive message command arguments
   */
  sendReceivedMessageCommand = async (
    arg: ReceiveMessageCommandArgs,
  ): Promise<ReceiveMessageCommandResponse> => appSyncProvider.sendReceivedMessageCommand(arg);

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
      const assignee = conversation.typeLsi
        ? conversation.typeLsi.split(PARTITION_KEY_DELIMITER)[1]
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
    const typeLsi = `${ASSIGNEE_INDEX}#${UNKNOWN_USER}`;
    newConversation = {
      info: zaloConversation,
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
