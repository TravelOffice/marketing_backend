import { Session } from '../../models/Session';
import { CognitoUser } from '../../models/CognitoUser';

export interface ActivateSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
  ): Promise<Session>,
}
