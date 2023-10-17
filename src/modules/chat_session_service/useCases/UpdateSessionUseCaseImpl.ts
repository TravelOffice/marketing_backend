import { Session } from '../models/Session';
import { UpdateSessionUseCase } from './interfaces/UpdateSessionUseCase';
import { UpdateSessionDto } from '../dto/UpdateSessionDto';
import { CognitoUser } from '../models/CognitoUser';
import { sessionRepository } from '../repositories';

export default class UpdateSessionUseCaseImpl implements UpdateSessionUseCase {
  /**
   * Invokes the UpdateSessionUseCase to update a session.
   *
   * @param currentUser - The current user invoking the use case.
   * @param conversationId - The conversation ID of the session.
   * @param sessionId - The ID of the session to update.
   * @param updateSessionDto - The DTO (data transfer object) containing the updated session data.
   * @returns A Promise that resolves to the updated session.
   * @throws Error if the session with the specified ID is not found.
   */
  async invoke(
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
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

    const dataToUpdate = await this.buildDataToUpdate({
      currentUser, conversationId, sessionId, currentSession, updateSessionDto,
    });
    return sessionRepository.update(
      currentUser.tenant,
      conversationId,
      sessionId,
      dataToUpdate,
    );
  }

  /**
   * Builds the data to update based on the provided options.
   *
   * @param options - The options for building the data to update.
   * @returns A Promise that resolves to the data to update.
   */
  async buildDataToUpdate(options: {
    currentUser: CognitoUser,
    conversationId: string,
    sessionId: string,
    currentSession: Session,
    updateSessionDto: UpdateSessionDto,
  }): Promise<UpdateSessionDto> {
    const { currentSession, updateSessionDto } = options;
    const now = Date.now();
    let dataToUpdate: Partial<Session> = {};
    const props = Object.keys(updateSessionDto);
    props.forEach((key) => {
      const prop = key as keyof UpdateSessionDto;
      if (currentSession[prop] !== updateSessionDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateSessionDto[prop] };
      }
    });
    dataToUpdate.updatedAt = now;

    return dataToUpdate as UpdateSessionDto;
  }
}
