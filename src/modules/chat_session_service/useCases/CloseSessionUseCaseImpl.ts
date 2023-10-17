import { helper, logger } from 'core';
import { ChatSessionStatus, Session } from '../models/Session';
import { CognitoUser } from '../models/CognitoUser';
import { sessionRepository } from '../repositories';
import { CloseSessionUseCase } from './interfaces/CloseSessionUseCase';

export default class CloseSessionUseCaseImpl implements CloseSessionUseCase {
  /**
   * Close session.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The conversation ID of the session.
   * @param sessionId - The ID of the session to close.
   * @param latestMessage - The latest message of the session.
   * @returns A Promise that resolves to the updated session.
   * @throws Error if the session with the specified ID is not found.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
    latestMessage: string,
  ): Promise<Session> {
    logger.log(`Close session ${sessionId} of conversation ${conversationId} for tenant ${currentUser.tenant}`);

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

    if (currentSession.status === ChatSessionStatus.CLOSED) {
      throw new Error(`Session ${sessionId} is already closed`);
    }

    const now = Date.now();
    const duration = (now - currentSession.startTime) / 1000; // convert milliseconds to seconds
    const dataToUpdate: Partial<Session> = {
      status: ChatSessionStatus.CLOSED,
      updatedAt: now,
      endTime: now,
      duration,
      latestMessage,
      lsi1: now.toString(), // createdAt
      lsi2: duration.toString(), // duration
      lsi3: `${currentUser.username}#${ChatSessionStatus.CLOSED}`, // assigneeId#status
      lsi4: ChatSessionStatus.CLOSED, // status
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
