import { ChatSession } from '../../models/ChatSession';

export interface ChatSessionRepository {
  create(
    tenantId: string,
    conversationId: string,
    session: Partial<ChatSession>,
  ): Promise<Partial<ChatSession>>,

  generateChatSessionCode(tenantId: string): Promise<string>,
}
