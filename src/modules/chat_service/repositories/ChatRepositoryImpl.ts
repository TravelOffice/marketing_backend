import { NewConversationInfo } from 'auto-assign-utilities/models';
import AWS from 'aws';
import { DDBConversation } from 'common-models';
import { getAwsSecretValue } from 'get-env';
import { ConversationQueryParams } from '../models/ConversationQueryParams';
import { dynamoProvider, AttributeValues } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import { UNKNOWN_USER } from '../utils/constants';
import {
  ASSIGNEE_INDEX,
  CONVERSATION_ASSSIGNEE_INDEX,
  CONVERSATION_INDEX,
  PARTITION_KEY_DELIMITER, TENANT_INDEX,
} from '../utils/dynamodbConstants';
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
   * Get list unassigned conversation of platform page
   * @param tenant The tenant ID
   * @returns Conversation data
   */
  getUnassignedConversations = async (tenant: string) => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const query: QueryInput = {
      TableName: table,
      IndexName: CONVERSATION_ASSSIGNEE_INDEX,
      ExpressionAttributeNames: {
        '#kn0': 'lsi1',
        '#kn1': 'pk',
      },
      ExpressionAttributeValues: {
        ':kv0': { S: `${ASSIGNEE_INDEX}#${UNKNOWN_USER}` },
        ':kv1': { S: `${TENANT_INDEX}#${tenant}` },
      },
      KeyConditionExpression: '#kn0 = :kv0 AND begins_with(#kn1, :kv1)',
    };
    const { Items } = await dynamoProvider.rawQuery(query);
    const unassignConversations = Items as Array<AttributeValues>;
    if (!unassignConversations || unassignConversations.length === 0) {
      throw new Error(`Tenant [${tenant}]: Not found any unassign conversations!`);
    }
    return unassignConversations.map((element) => {
      const conversation = AWS.DynamoDB.Converter.unmarshall(element) as DDBConversation;
      const [, , , chatPlatform, pageId] = conversation.pk.split(PARTITION_KEY_DELIMITER);
      const [, conversationId] = conversation.sk.split(PARTITION_KEY_DELIMITER);
      return {
        tenant,
        pageId,
        chatPlatform,
        conversationId,
      } as NewConversationInfo;
    });
  };

  /**
   * Get list tenant name which has unassigned conversation
   * @returns List tenant name which has unassigned conversation
   */
  getListTenantHasUnassignedConversations = async () => {
    const table = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const query: QueryInput = {
      TableName: table,
      IndexName: CONVERSATION_ASSSIGNEE_INDEX,
      ExpressionAttributeNames: {
        '#kn0': 'lsi1',
        '#kn1': 'pk',
      },
      ExpressionAttributeValues: {
        ':kv0': { S: `${ASSIGNEE_INDEX}#${UNKNOWN_USER}` },
        ':kv1': { S: `${TENANT_INDEX}#` },
      },
      KeyConditionExpression: '#kn0 = :kv0 AND begins_with(#kn1, :kv1)',
    };
    const { Items } = await dynamoProvider.rawQuery(query);
    const unassignConversations = Items as Array<AttributeValues>;
    if (!unassignConversations || unassignConversations.length === 0) {
      throw new Error('Not found any unassign conversations!');
    }
    const tenants = unassignConversations.map((element) => {
      const conversation = AWS.DynamoDB.Converter.unmarshall(element) as DDBConversation;
      const [, tenant] = conversation.pk.split(PARTITION_KEY_DELIMITER);
      return tenant as string;
    });

    // Remove dupplicated tenant
    return [...new Set(tenants)];
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
        assignee,
        updatedAt,
        lsi1: `${ASSIGNEE_INDEX}#${assignee}`,
      },
    );
    logger.log(`Conversation has been updated, new data is ${updatedConversation}`);
  };
}
