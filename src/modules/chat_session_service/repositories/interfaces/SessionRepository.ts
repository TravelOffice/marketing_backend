import { ChatSession, ChatSessionStatus } from '../../models/ChatSession';

export interface SessionRepository {
  listByConversationId(tenantId: string, conversationId: string): Promise<Array<ChatSession>>,

  listByConversationIdAndStatus(
    tenantId: string,
    conversationId: string,
    status: ChatSessionStatus
  ): Promise<Array<ChatSession>>,

  listByAssigneeIdAndStatus(
    tenantId: string,
    assigneeId: string,
    conversationId: string,
    status: ChatSessionStatus,
  ): Promise<Array<ChatSession>>,

  create(
    tenantId: string,
    conversationId: string,
    session: Partial<ChatSession>
  ): Promise<ChatSession>,

  update(
    tenantId: string,
    conversationId: string,
    sessionId: string,
    session: Partial<ChatSession>,
  ): Promise<ChatSession>,

  get(
    tenantId: string,
    conversationId: string,
    sessionId: string
  ): Promise<ChatSession | undefined>,

  generateChatSessionCode(tenantId: string): Promise<string>,
}
