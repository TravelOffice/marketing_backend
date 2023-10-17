import { Session } from '../../models/Session';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetListOfSessionByConversationIdUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
  ): Promise<Array<Session>>,
}
