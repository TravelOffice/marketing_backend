import {
  ChatPlatform,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import {
  CONVERSATION_INDEX,
  PARTITION_KEY_DELIMITER,
  TENANT_INDEX,
} from '../utils/constants';
import { ChatPlatformRepository } from './interfaces/ChatPlatformRepository';

export default class ChatPlatformRepositoryImpl implements ChatPlatformRepository {
  /**
   * Method to get chat (aka conversation) information
   * @param tenantId The id of the Tenant which the user should belong to
   * @param page The id of page
   * @param conversationId The id of the conversation
   * @returns Promise<TelegramConversationWithAssignee> The conversation information with assigneeId
   */
  getConversationsAssignee = async (
    tenantId: string,
    pageId: string,
    conversationId: string,
    chatPlatform: ChatPlatform,
  ) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');

    const item = await dynamoProvider.get(
      table,
      `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${chatPlatform.toUpperCase()}#${pageId}`,
      `${CONVERSATION_INDEX}#${conversationId}`,
    );

    if (!item) throw new Error(`Conversation [${conversationId}] not found.`);

    const { lsi1 } = item;
    const [, assignee] = lsi1.split(PARTITION_KEY_DELIMITER);
    return assignee;
  };
}
