import {
  ChatPlatform,
  DDBConversation, FacebookMessageContent,
  FacebookPage, ReceiveMessageCommandArgs,
  ReceiveMessageCommandResponse,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { FacebookConversationWithAssignee, RestrictedFacebookConversation } from '../models/RestrictedFacebookModels';
import { appSyncProvider, dynamoProvider, fbMessagePlatformProvider } from '../providers';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX, PARTITION_KEY_DELIMITER, TENANT_INDEX,
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
    page: FacebookPage,
    customerId: string,
    message: FacebookMessageContent,
  ) => {
    // Get remote conversation
    const fbConversation = await fbMessagePlatformProvider.getConversation(
      page.accessToken,
      page.id,
      customerId,
    );
    if (!fbConversation) {
      throw new Error(`Could not found the remote conversation of page: ${JSON.stringify(page)} and customer ${customerId}`);
    }

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
}
