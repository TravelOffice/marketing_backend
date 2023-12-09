import { ChatSession } from '../../models';

export interface ChatSessionRepository {
  getOpenSession: (tenant: string, conversationId: string) => Promise<ChatSession | undefined>,
  markSessionActiveIfNeeded: (chatSession: ChatSession) => Promise<void>,
}
