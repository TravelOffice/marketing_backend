import { ChatSessionStatus, Session } from '../../models/Session';
import { UpdateSessionDto } from '../../dto/UpdateSessionDto';

export interface SessionRepository {
  listByConversationId(tenantId: string, conversationId: string): Promise<Array<Session>>,

  listByAssigneeIdAndStatus(
    tenantId: string,
    assigneeId: string,
    status: ChatSessionStatus,
  ): Promise<Array<Session>>,

  create(tenantId: string, conversationId: string, session: Partial<Session>): Promise<Session>,

  update(
    tenantId: string,
    conversationId: string,
    sessionId: string,
    session: Partial<UpdateSessionDto>,
  ): Promise<Session>,

  get(tenantId: string, conversationId: string, sessionId: string): Promise<Session | undefined>,

  generateChatSessionCode(tenantId: string): Promise<string>,
}
