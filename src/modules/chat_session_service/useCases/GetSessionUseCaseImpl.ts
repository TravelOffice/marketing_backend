import { helper } from 'core';
import { GetSessionUseCase } from './interfaces/GetSessionUseCase';
import { ChatSession } from '../models/ChatSession';
import { CognitoUser } from '../models/CognitoUser';
import { chatSessionRepository } from '../repositories';

export default class GetSessionUseCaseImpl implements GetSessionUseCase {
  /**
   * Get session.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The conversation ID of the session.
   * @param sessionId - The ID of the session to retrieve.
   * @returns A Promise that resolves to the retrieved source, or undefined if not found.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
  ): Promise<ChatSession | undefined> {
    const source = await chatSessionRepository.get(currentUser.tenant, conversationId, sessionId);
    if (!source) return undefined;
    return helper.excludeDataFromObject(source) as ChatSession;
  }
}
