import { ChatSession } from '../../models/ChatSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string
  ): Promise<ChatSession | undefined>,
}
