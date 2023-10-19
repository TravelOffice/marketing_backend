import { ChatSession } from '../../models/ChatSession';

export interface ChatSessionRepository {

  create(
    tenantId: string,
    conversationId: string,
    session: Partial<ChatSession>,
  ): Promise<ChatSession>,

  generateChatSessionCode(tenantId: string): Promise<string>,
}
