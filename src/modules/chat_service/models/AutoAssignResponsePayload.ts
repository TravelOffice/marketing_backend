import { ChatSession } from './ChatSession';
import { User } from './User';

export interface AutoAssignResponsePayload {
  assignedSale: User;
  attachedChatSession: ChatSession;
}
