import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { ChatSession } from '../models/ChatSession';
import {
  CHAT_SESSION_COUNTER_INDEX,
  CHAT_SESSION_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { ChatSessionRepository } from './interfaces/ChatSessionRepository';

export default class ChatSessionRepositoryImpl implements ChatSessionRepository {
  /**
   * Creates a new session of a conversation for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param conversationId - Conversation ID
   * @param chatSession - The session object to create.
   * @returns A Promise that resolves to the created session.
   */
  async create(
    tenantId: string,
    conversationId: string,
    chatSession: Partial<ChatSession>,
  ): Promise<Partial<ChatSession>> {
    const chatTable = await getAwsSecretValue('DYNAMO_CHAT_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${CHAT_SESSION_INDEX}#${conversationId}`;
    const sk = `${chatSession.code}`;
    await dynamoProvider.putItem(chatTable, pk, sk, chatSession);
    return {
      pk,
      sk,
      ...chatSession,
    };
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
      CHAT_SESSION_COUNTER_INDEX,
    );
    return code.toString();
  }
}
