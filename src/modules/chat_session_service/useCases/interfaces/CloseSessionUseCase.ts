import { Session } from '../../models/Session';
import { CognitoUser } from '../../models/CognitoUser';

export interface CloseSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
    latestMessage?: string,
  ): Promise<Session>,
}
