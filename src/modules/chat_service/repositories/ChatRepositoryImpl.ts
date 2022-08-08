import { DDBConversation } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { ConversationQueryParams } from '../models/ConversationQueryParams';
import { dynamoProvider } from '../providers';
import { ASSIGNEE_INDEX, CONVERSATION_INDEX, TENANT_INDEX } from '../utils/dynamodbConstants';
import logger from '../utils/logger';
import { ChatRepository } from './interfaces/ChatRepository';

export default class ChatRepositoryImpl implements ChatRepository {
  /**
   * Get specific conversation of platform page
   * @param params Params to get conversation
   * @returns Conversation data
   */
  getConversation = async (params: ConversationQueryParams) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const chatPlatformIndex = params.chatPlatform.toUpperCase();
    const pk = `${TENANT_INDEX}#${params.tenant}#${CONVERSATION_INDEX}#${chatPlatformIndex}#${params.pageId}`;
    const sk = `${CONVERSATION_INDEX}#${params.conversationId}`;
    return dynamoProvider.getItem<DDBConversation>(table, pk, sk);
  };

  /**
   * Assign new employee for given conversation
   * @param conversation Conversation data returned by DynamoDB
   * @param assignee New assignee of conversation
   */
  saveConversationWithNewAssignee = async (conversation: DDBConversation, assignee: string) => {
    // Chat table from secrets
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');

    // Add a new conversation item
    const updatedAt = Date.now();
    const updatedConversation = await dynamoProvider.updateItemWithSetExpression(
      table,
      conversation.pk,
      conversation.sk,
      {
        updatedAt,
        typeLsi: `${ASSIGNEE_INDEX}#${assignee}`,
      },
    );
    logger.log(`Conversation has been updated, new data is ${updatedConversation}`);
  };
}
