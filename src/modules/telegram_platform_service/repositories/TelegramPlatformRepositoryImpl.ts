import AWS from 'aws';
import { ChatPlatformStrings } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { RestrictedTelegramConversation } from '../models';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  PARTITION_KEY_DELIMITER,
  TENANT_INDEX,
} from '../utils/constants';
import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';

export default class TelegramPlatformRepositoryImpl implements TelegramPlatformRepository {
  /**
   * Get chat (aka conversation) information
   */
  getChat = async () => {
    throw new Error('Method is not implemented yet.');
  };

  /**
   * Get user profile information
   */
  getUserProfile = async () => {
    throw new Error('Method is not implemented yet.');
  };

  /**
   * Send message to Telegram user
   */
  sendMessage = async () => {
    throw new Error('Method is not implemented yet.');
  };

  getConversations = async (tenantId: string, botId: string, assigneeId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr: ChatPlatformStrings = 'telegram'; // Platform unique code

    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'TypeIndex',
      KeyConditionExpression: 'pk = :pk AND begins_with(typeLsi, :lsi_filter_value)',
      ExpressionAttributeValues: {
        // Combination of TENANT#<tenant_id>#CONVERSATION#<platform>#<id>
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr.toUpperCase()}#${botId}` },
        // Combination of ASSIGNEE#<username>
        ':lsi_filter_value': { S: `${ASSIGNEE_INDEX}#${assigneeId}` },
      },
    };
    const { Items: conversationItems } = await dynamoProvider.rawQuery(params);
    if (conversationItems) {
      return conversationItems.map((item: AWS.DynamoDB.AttributeMap) => {
        const conversation = AWS.DynamoDB.Converter.unmarshall(item);
        const {
          sk, pk, typeLsi, ...rest
        } = conversation;
        const [, conversationId] = sk.split(PARTITION_KEY_DELIMITER);
        return {
          ...rest,
          conversationId,
        } as RestrictedTelegramConversation;
      });
    }
    return [];
  };
}
