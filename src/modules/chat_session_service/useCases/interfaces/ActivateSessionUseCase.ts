import { ChatSession } from '../../models/ChatSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface ActivateSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
  ): Promise<ChatSession>,
}
