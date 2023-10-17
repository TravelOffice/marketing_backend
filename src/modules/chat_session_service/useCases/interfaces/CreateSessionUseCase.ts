import { Session } from '../../models/Session';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreateSessionUseCase {
  invoke(currentUser: CognitoUser, conversationId: string): Promise<Session>,
}
