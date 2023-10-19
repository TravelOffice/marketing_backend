import { subscribedUserRepository, userDeviceSessionRepository } from '../repositories';
import { SubscribeToTopicUseCase } from './interfaces/SubscribeToTopicUseCase';
import { AppType } from '../models/UserDeviceSession';
import logger from '../utils/logger';

export default class SubscribeToTopicUseCaseImpl implements SubscribeToTopicUseCase {
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
      await subscribedUserRepository.create(topic, authorId, deviceTokens);
      logger.log(`Subscribed to ${topic} for user ${authorId} successfully`);
    }
  };
}
