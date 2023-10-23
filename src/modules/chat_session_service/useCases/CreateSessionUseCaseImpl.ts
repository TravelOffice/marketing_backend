import { helper } from 'core';
import { ChatPlatform } from 'common-models';
import { ChatSession, ChatSessionStatus } from '../models/ChatSession';
import { sessionRepository } from '../repositories';
import { CreateSessionUseCase } from './interfaces/CreateSessionUseCase';
import { CognitoUser } from '../models/CognitoUser';

/**
 * Implementation of the CreateSessionUseCase.
 */
export default class CreateSessionUseCaseImpl implements CreateSessionUseCase {
  /**
   * Invokes the CreateSessionUseCase to create a session.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The conversation ID of the session.
   * @param platform - The platform of the session.
   * @returns A Promise that resolves to the created session.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
    platform: ChatPlatform,
  ): Promise<ChatSession> {
    // Check if the user already has an open session for the conversation
    const openSessionsOfUser = await sessionRepository.listByAssigneeIdAndStatus(
      currentUser.tenant,
      currentUser.username,
      conversationId,
      ChatSessionStatus.OPEN,
    );
    if (openSessionsOfUser.some((session) => session.conversationId === conversationId)) {
      throw new Error(`User ${currentUser.username} already has an open session for conversation ${conversationId}`);
    }

    // Check if the user already has an active session for the conversation
    const activeSessionsOfUser = await sessionRepository.listByAssigneeIdAndStatus(
      currentUser.tenant,
      currentUser.username,
      conversationId,
      ChatSessionStatus.ACTIVE,
    );
    if (activeSessionsOfUser.some((session) => session.conversationId === conversationId)) {
      throw new Error(`User ${currentUser.username} already has an active session for conversation ${conversationId}`);
    }

    const dataToCreate = await this.buildSession({ currentUser, conversationId, platform });
    const createdSession = await sessionRepository.create(
      currentUser.tenant,
      conversationId,
      dataToCreate,
    );
    return helper.excludeDataFromObject(createdSession) as ChatSession;
  }

  /**
   * Builds the session object using the provided options.
   *
   * @param options - The options for building the session.
   * @returns A Promise that resolves to the built session.
   */
  private async buildSession(options: {
    currentUser: CognitoUser,
    conversationId: string,
    platform: ChatPlatform,
  }): Promise<Partial<ChatSession>> {
    const now = Date.now();
    const { currentUser, conversationId, platform } = options;

    return {
      code: await sessionRepository.generateChatSessionCode(currentUser.tenant),
      conversationId,
      platform,
      startTime: now,
      assigneeId: currentUser.username,
      assigneeName: currentUser.name,
      status: ChatSessionStatus.OPEN,
      createdAt: now,
      updatedAt: now,
      lsi1: now.toString(), // createdAt
      lsi3: `${currentUser.username}#${ChatSessionStatus.OPEN}`, // assigneeId#status
      lsi4: ChatSessionStatus.OPEN, // status
    };
  }
}
