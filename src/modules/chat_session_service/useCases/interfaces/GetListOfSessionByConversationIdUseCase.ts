import { ChatSession } from '../../models/ChatSession';
import { CognitoUser } from '../../models/CognitoUser';

export interface GetListOfSessionByConversationIdUseCase {
  invoke(
    currentUser: CognitoUser,
    conversationId: string,
  ): Promise<Array<ChatSession>>,
}
