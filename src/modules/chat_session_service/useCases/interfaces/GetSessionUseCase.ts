import { Session } from '../../models/Session';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetSessionUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string
  ): Promise<Session | undefined>,
}
