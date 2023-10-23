import { helper } from 'core';
import { sessionRepository } from '../repositories';
import { GetListOfSessionByConversationIdUseCase } from './interfaces/GetListOfSessionByConversationIdUseCase';
import { ChatSession, ChatSessionStatus } from '../models/ChatSession';
import { CognitoUser } from '../models/CognitoUser';

export default class GetListOfSessionByConversationIdImpl
implements GetListOfSessionByConversationIdUseCase {
  /**
   * Lists all sessions by conversationId for the specified tenant.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The ID of the conversation.
   * @param status - The status of the session.
   * @returns A Promise that resolves to an array of sources.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
    status?: ChatSessionStatus,
  ): Promise<Array<ChatSession>> {
    let sessions: ChatSession[] = [];
    if (status) {
      sessions = await sessionRepository.listByConversationIdAndStatus(
        currentUser.tenant,
        conversationId,
        status,
      );
    } else {
      sessions = await sessionRepository.listByConversationId(
        currentUser.tenant,
        conversationId,
      );
    }

    return sessions.map((session) => helper.excludeDataFromObject(session) as ChatSession);
  }
}
