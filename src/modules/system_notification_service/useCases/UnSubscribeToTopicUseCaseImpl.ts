import { subscribedUserRepository, userDeviceSessionRepository } from '../repositories';
import { UnsubscribeFromTopicUseCase } from './interfaces/UnsubscribeFromTopicUseCase';
import { AppType } from '../models/UserDeviceSession';
import logger from '../utils/logger';

export default class UnsubscribeToTopicUseCaseImpl implements UnsubscribeFromTopicUseCase {
  /**
   * Creates a new user device session.
   *
   * @param authorId
   * @param appType
   * @param topic
   * @throws {Error}
   */
  invoke = async (
    authorId: string,
    appType: AppType,
    topic: string,
  ): Promise<void> => {
    const userSessions = await userDeviceSessionRepository.listByUser(authorId, appType);
    const deviceTokens = userSessions.map((session) => session.token);
    if (deviceTokens.length > 0) {
      // Delete subscribe information into dynamo db
      await subscribedUserRepository.delete(
        topic,
        authorId,
        deviceTokens,
      );
    }
    logger.log(`Unsubscribed to ${topic} for user ${authorId} successfully`);
  };
}
