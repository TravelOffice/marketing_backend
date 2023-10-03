import { CognitoUser } from '../models/CognitoUser';
import { subscribedUserRepository, userDeviceSessionRepository } from '../repositories';
import { SubscribeToTopicUseCase } from './interfaces/SubscribeToTopicUseCase';
import { SubscribedUser } from '../models/SubscribedUser';

export default class SubscribeToTopicUseCaseImpl implements SubscribeToTopicUseCase {
  /**
   * Creates a new user device session.
   *
   * @param {CognitoUser} currentUser - Current user.
   * @param topic
   * @throws {Error}
   */
  invoke = async (
    currentUser: CognitoUser,
    topic: string,
  ): Promise<void> => {
    const { tenant, username } = currentUser;
    const userSessions = await userDeviceSessionRepository.listByUser(`${tenant}#${username}`);
    const deviceTokens = userSessions.map((session) => session.token);
    await subscribedUserRepository.create({
      userId: `${tenant}#${username}`,
      topic,
      deviceTokens,
    } as SubscribedUser);
  };
}
