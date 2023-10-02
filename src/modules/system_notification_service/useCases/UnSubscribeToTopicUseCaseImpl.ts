import { fcmProvider } from 'core';
import { CognitoUser } from '../models/CognitoUser';
import { subscribedUserRepository, userDeviceSessionRepository } from '../repositories';
import { UnsubscribeFromTopicUseCase } from './interfaces/UnsubscribeFromTopicUseCase';
import { SubscribedUser } from '../models/SubscribedUser';

export default class UnsubscribeToTopicUseCaseImpl implements UnsubscribeFromTopicUseCase {
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

    // Subscribe to FCM topic
    await fcmProvider.unsubscribeTopic(deviceTokens, topic);
    // Save subscribe information into dynamo db
    await subscribedUserRepository.delete({
      topic,
      userId: `${tenant}#${username}`,
      deviceTokens,
    } as SubscribedUser);
  };
}
