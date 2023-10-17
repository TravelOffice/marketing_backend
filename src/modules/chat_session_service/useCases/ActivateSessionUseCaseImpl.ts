import { helper, logger } from 'core';
import { ChatSessionStatus, Session } from '../models/Session';
import { CognitoUser } from '../models/CognitoUser';
import { sessionRepository } from '../repositories';
import { ActivateSessionUseCase } from './interfaces/ActivateSessionUseCase';

export default class ActivateSessionUseCaseImpl implements ActivateSessionUseCase {
  /**
   * Activate session.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The conversation ID of the session.
   * @param sessionId - The ID of the session to activate.
   * @returns A Promise that resolves to the updated session.
   * @throws Error if the session with the specified ID is not found.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
  ): Promise<Session> {
    logger.log(`Activate session ${sessionId} of conversation ${conversationId} for tenant ${currentUser.tenant}`);

    const currentSession = await sessionRepository.get(
      currentUser.tenant,
      conversationId,
      sessionId,
    );
    if (!currentSession) throw new Error(`Could not found session ${sessionId}`);

    // Check if the user is the assignee of the session
    if (currentSession.assigneeId !== currentUser.username) {
      throw new Error(`User ${currentUser.username} is not the assignee of session ${sessionId}`);
    }

    if (currentSession.status !== ChatSessionStatus.OPEN) {
      throw new Error(`Only activate session with status ${ChatSessionStatus.OPEN}`);
    }

    const now = Date.now();
    const responseTime = (now - currentSession.startTime) / 1000; // convert milliseconds to seconds
    const dataToUpdate: Partial<Session> = {
      status: ChatSessionStatus.ACTIVE,
      updatedAt: now,
      responseTime,
      lsi3: `${currentUser.username}#${ChatSessionStatus.ACTIVE}`, // assigneeId#status
      lsi4: ChatSessionStatus.ACTIVE, // status
      lsi5: responseTime.toString(),
    };
    const updatedSession = await sessionRepository.update(
      currentUser.tenant,
      conversationId,
      sessionId,
      dataToUpdate,
    );
    return helper.excludeDataFromObject(updatedSession) as Session;
  }
}
