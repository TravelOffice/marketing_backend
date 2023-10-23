import { ChatSession, ChatSessionStatus } from '../../models/ChatSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetListOfSessionByConversationIdUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    status?: ChatSessionStatus,
  ): Promise<Array<ChatSession>>,
}
