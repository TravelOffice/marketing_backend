import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { ChatSession, ChatSessionStatus } from '../models/ChatSession';
import { SESSION_COUNTER_INDEX, SESSION_INDEX, TENANT_INDEX } from '../utils/constants';
import { ChatSessionRepository } from './interfaces/ChatSessionRepository';
import { CreateSessionDto } from '../dto/CreateSessionDto';

/**
 * Implementation of the SessionRepository interface.
 */
export default class ChatSessionRepositoryImpl implements ChatSessionRepository {
  /**
   * Lists all sessions by conversationId for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param conversationId - The ID of the conversation.
   * @returns A Promise that resolves to an array of sessions.
   */
  async listByConversationId(tenantId: string, conversationId: string): Promise<ChatSession[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${SESSION_INDEX}#${conversationId}`,
      },
    });
  }

  /**
   * Lists all sessions by conversationId and status for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param conversationId - The ID of the conversation.
   * @param status - The status of the session.
   * @returns A Promise that resolves to an array of sessions.
   */
  async listByConversationIdAndStatus(
    tenantId: string,
    conversationId: string,
    status: ChatSessionStatus,
  ): Promise<ChatSession[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      IndexName: 'Index4',
      KeyConditionExpression: 'pk = :pk AND lsi4 = :lsi4',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${SESSION_INDEX}#${conversationId}`,
        ':lsi4': `${status}`,
      },
    });
  }

  /**
   * Lists all sessions by assigneeId and status for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param assigneeId - The ID of the assignee.
   * @param conversationId - The ID of the conversation.
   * @param status - The status of the session.
   * @returns A Promise that resolves to an array of sessions.
   */
  async listByAssigneeIdAndStatus(
    tenantId: string,
    assigneeId: string,
    conversationId: string,
    status: ChatSessionStatus,
  ): Promise<ChatSession[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi3, :lsi3)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${SESSION_INDEX}#${conversationId}`,
        ':lsi3': `${assigneeId}#${status}`,
      },
    });
  }

  /**
   * Retrieves a session by its ID, conversationId, tenant ID.
   *
   * @param tenantId - The ID of the tenant.
   * @param conversationId - The ID of the conversation.
   * @param sessionId - The ID of the session.
   * @returns A Promise that resolves to the retrieved session, or undefined if not found.
   */
  async get(
    tenantId: string,
    conversationId: string,
    sessionId: string,
  ): Promise<ChatSession | undefined> {
    return dynamoProvider.getItem<ChatSession>(
      await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${SESSION_INDEX}#${conversationId}`,
      `${sessionId}`,
    );
  }

  /**
   * Creates a new session of a conversation for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param conversationId - The ID of the conversation.
   * @param session - The session object to create.
   * @returns A Promise that resolves to the created session.
   */
  async create(
    tenantId: string,
    conversationId: string,
    session: CreateSessionDto,
  ): Promise<ChatSession> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${SESSION_INDEX}#${conversationId}`,
      `${session.code}`,
      session,
    );
    return helper.excludeDataFromObject(session) as ChatSession;
  }

  /**
   * Updates a session for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param conversationId - The ID of the conversation.
   * @param sessionId - The ID of the session to update.
   * @param sessionToUpdate - The session object to update.
   * @returns A Promise that resolves to the updated session.
   */
  async update(
    tenantId: string,
    conversationId: string,
    sessionId: string,
    sessionToUpdate: Partial<ChatSession>,
  ): Promise<ChatSession> {
    const updatedSession = await dynamoProvider.updateItemWithSetExpression(
      await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${SESSION_INDEX}#${conversationId}`,
      `${sessionId}`,
      sessionToUpdate,
    );

    return helper.excludeDataFromObject(updatedSession.Attributes as ChatSession) as ChatSession;
  }

  /**
   * Generates a chat session code for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @returns A Promise that resolves to the generated chat session code.
   */
  async generateChatSessionCode(tenantId: string): Promise<string> {
    const code = await helper.generateCode(
      await getAwsSecretValue('DYNAMO_CHAT_TABLE'),
      `${TENANT_INDEX}#${tenantId}`,
      SESSION_COUNTER_INDEX,
    );
    return code.toString();
  }
}
