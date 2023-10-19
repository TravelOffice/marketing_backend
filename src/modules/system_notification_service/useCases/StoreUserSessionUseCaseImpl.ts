import { fcmProvider } from 'core';
import { CognitoUser } from '../models/CognitoUser';
import { UserDeviceSession } from '../models/UserDeviceSession';
import { CreateUserDeviceSessionDto } from '../models/dto/CreateUserDeviceSessionDto';
import { subscribedUserRepository, userDeviceSessionRepository } from '../repositories';
import { StoreUserSessionUseCase } from './interfaces/StoreUserSessionUseCase';
import logger from '../utils/logger';

export default class StoreUserSessionUseCaseImpl implements StoreUserSessionUseCase {
  /**
   * Creates a new user device session.
   *
   * @param {CognitoUser} currentUser - Current user.
   * @param {CreateUserDeviceSessionDto} createSessionDto - DTO for creating a user device session.
   * @returns {Promise<UserDeviceSession>}
   *  A promise that resolves to the created user device session.
   * @throws {Error}
   */
  invoke = async (
    currentUser: CognitoUser,
    createSessionDto: CreateUserDeviceSessionDto,
  ): Promise<UserDeviceSession> => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    const { token, appType } = createSessionDto;
    // Check whether the device token exists in the database.
    // If it exists, return the existing user device session.
    const existingUserDeviceSession = await userDeviceSessionRepository
      .getByDeviceToken(userId, appType, token);
    if (existingUserDeviceSession) {
      return existingUserDeviceSession;
    }

    // If it doesn't exist, create a new user device session.
    const now = Date.now();
    const session = {
      ...createSessionDto,
      createdAt: now,
      updatedAt: now,
      lsi1: now.toString(),
    } as UserDeviceSession;
    const userDeviceSession = await userDeviceSessionRepository.create(
      userId,
      appType,
      session,
    );

    if (!userDeviceSession) {
      throw new Error('Failed to create user device session');
    }

    logger.log(`Create user ${userId} device session successfully`);

    // Subscribe new device token to current user's topics
    const subscribedUsers = await subscribedUserRepository.listByUser(userId);
    if (subscribedUsers.length > 0) {
      const promises: Promise<void>[] = [];
      subscribedUsers.forEach((item) => {
        const { topic } = item;
        promises.push(fcmProvider.subscribeToTopic([token], topic));
      });
      await Promise.all(promises);
    }

    return userDeviceSession;
  };
}
