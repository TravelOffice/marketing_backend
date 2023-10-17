import { helper } from 'core';
import { sessionRepository } from '../repositories';
import { GetListOfSessionByConversationIdUseCase } from './interfaces/GetListOfSessionByConversationIdUseCase';
import { Session } from '../models/Session';
import { CognitoUser } from '../models/CognitoUser';

export default class GetListOfSessionByConversationIdImpl
implements GetListOfSessionByConversationIdUseCase {
  /**
   * Lists all sessions by conversationId for the specified tenant.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The ID of the conversation.
   * @returns A Promise that resolves to an array of sources.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
  ): Promise<Array<Session>> {
    const sessions = await sessionRepository.listByConversationId(
      currentUser.tenant,
      conversationId,
    );
    return sessions.map((session) => helper.excludeDataFromObject(session) as Session);
  }
}
