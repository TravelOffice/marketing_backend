import AWS from 'aws';
import {
  ChatPlatform,
  ChatPlatformStrings, SendMessageOptions,
} from 'common-models';
import { getAwsSecretValue } from 'get-env';
import {
  RestrictedTelegramConversation,
  RestrictedTelegramMessage,
  TelegramConversationWithAssignee,
  TelegramPagingMessage,
} from '../models';
import { dynamoProvider, telegramProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_INDEX,
  MESSAGE_INDEX,
  PAGINATION_LIMIT,
  PARTITION_KEY_DELIMITER,
  TENANT_INDEX,
  PAGE_INDEX,
} from '../utils/constants';
import { TelegramPlatformRepository } from './interfaces/TelegramPlatformRepository';

export default class TelegramPlatformRepositoryImpl implements TelegramPlatformRepository {
  /**
   * Method to get chat (aka conversation) information
   * @param tenantId The id of the Tenant which the user should belong to
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @returns Promise<TelegramConversationWithAssignee> The conversation information with assigneeId
   */
  getChat = async (tenantId: string, botId: string, chatId: string) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr = ChatPlatform.telegram.toUpperCase();

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr}#${botId}`,
      `${CONVERSATION_INDEX}#${chatId}`,
    );

    if (!item) throw new Error(`Conversation [${chatId}] not found.`);

    const {
      pk, sk, typeLsi, ...conversation
    } = item;
    const [, assignee] = typeLsi.split(PARTITION_KEY_DELIMITER);
    return {
      ...conversation,
      conversationId: chatId,
      assignee,
    } as TelegramConversationWithAssignee;
  };

  /**
   * Method to get conversation messages
   * @param tenantId The id of the Tenant which the user should belong to
   * @param botId The id of telegram bot
   * @param chatId The id of the conversation
   * @param nextToken The token to get next paging item
   * @param limit The page size
   * @returns Promise<TelegramPagingMessage> All messages of the conversation
   */
  getConversationMessages = async (
    tenantId: string,
    botId: string,
    chatId: string,
    nextToken?: string,
    limit?: number,
  ) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const paginationLimit = limit || PAGINATION_LIMIT;
    const telegramPlatformStr = ChatPlatform.telegram.toUpperCase();
    const params: QueryInput = {
      TableName: dynamoTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${MESSAGE_INDEX}#${telegramPlatformStr}#${botId}` },
        ':sk': { S: `${CONVERSATION_INDEX}#${chatId}#${MESSAGE_INDEX}#` },
      },
      ScanIndexForward: false, // Sort descending
      Limit: paginationLimit,
      ExclusiveStartKey: nextToken ? AWS.DynamoDB.Converter.marshall(
        JSON.parse(nextToken),
      ) : undefined,
    };
    const { LastEvaluatedKey, Items: messageItems } = await dynamoProvider.rawQuery(params);
    if (messageItems) {
      return {
        nextToken: LastEvaluatedKey ? JSON.stringify(
          AWS.DynamoDB.Converter.unmarshall(LastEvaluatedKey),
        ) : undefined,
        messages: messageItems.map((item: AWS.DynamoDB.AttributeMap) => {
          const messages = AWS.DynamoDB.Converter.unmarshall(item);
          const {
            sk, pk, typeLsi, ...rest
          } = messages;
          return {
            content: rest.content,
          } as RestrictedTelegramMessage;
        }),
      } as TelegramPagingMessage;
    }
    return {
      messages: [],
    } as TelegramPagingMessage;
  };

  /**
   * Get user profile information
   */
  getUserProfile = async () => {
    throw new Error('Method is not implemented yet.');
  };

  getConversations = async (tenantId: string, botId: string, assigneeId?: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const telegramPlatformStr: ChatPlatformStrings = 'telegram'; // Platform unique code
    // Combination of ASSIGNEE#<username>
    const assigneeIndex = assigneeId ? `${ASSIGNEE_INDEX}#${assigneeId}` : `${ASSIGNEE_INDEX}#`;

    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'TypeIndex',
      KeyConditionExpression: 'pk = :pk AND begins_with(typeLsi, :lsi_filter_value)',
      ExpressionAttributeValues: {
        // Combination of TENANT#<tenant_id>#CONVERSATION#<platform>#<id>
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${CONVERSATION_INDEX}#${telegramPlatformStr.toUpperCase()}#${botId}` },
        ':lsi_filter_value': { S: assigneeIndex },
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

  getAccessToken = async (tenantId: string, botId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const telegramPlatformStr: ChatPlatformStrings = 'telegram';
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${PAGE_INDEX}#${telegramPlatformStr.toUpperCase()}#${botId}`;
    const telegramBot = await dynamoProvider.getItem(dynamoTable, pk, sk);
    if (telegramBot) {
      return telegramBot.accessToken;
    }
    throw new Error(`[TelegramPlatformRepository.getAccessToken] Can't get bot ${botId} token`);
  };

  /**
   * Send message to Telegram user
   */
  sendTextMessage = async (
    accessToken: string,
    chatId: string,
    text: string,
    options?: SendMessageOptions,
  ) => telegramProvider.sendTextMessage(accessToken, chatId, text, options);
}
