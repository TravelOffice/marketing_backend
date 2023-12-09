import { DDBConversation } from 'common-models';
import { QueryInput, dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  TENANT_INDEX,
  UNKNOWN_USER,
} from '../utils/constants';
import logger from '../utils/logger';
import { ChatRepository } from './interfaces/ChatRepository';

export default class ChatRepositoryImpl implements ChatRepository {
  /**
   * Get specific conversation by ReverseIndex
   * If don't know page id, use this function to get conversation
   *
   * @param params Params to get conversation
   * @returns Conversation data
   */
  getConversationByReverseIndex = async (params: {
    tenant: string,
    chatPlatform: string,
    conversationId: string,
  }) => {
    const chatTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const { tenant, chatPlatform, conversationId } = params;
    const queryParams: QueryInput = {
      TableName: chatTable,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_conversationId AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': `${TENANT_INDEX}#${tenant}#${CONVERSATION_INDEX}#${chatPlatform.toUpperCase()}#`,
        ':sk_conversationId': `${CONVERSATION_INDEX}#${conversationId}`,
      },
    };
    const conversations = await dynamoProvider.query(queryParams);
    if (conversations.length === 0) {
      return undefined;
    }

    return conversations.pop() as DDBConversation;
  };

  /**
   * Close conversation when chat session is closed
   *
   * @param conversation Conversation data returned by DynamoDB
   */
  closeConversation = async (conversation: DDBConversation) => {
    // Chat table from secrets
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');

    // Add a new conversation item
    const updatedAt = Date.now();
    await dynamoProvider.updateItemWithSetExpression(
      table,
      conversation.pk,
      conversation.sk,
      {
        assignee: UNKNOWN_USER,
        updatedAt,
        lsi1: `${ASSIGNEE_INDEX}#${UNKNOWN_USER}`,
      },
    );
    logger.log(`Conversation has been closed ${conversation.pk}#${conversation.sk}`);
  };
}
