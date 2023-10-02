import { CognitoUser } from '../models/CognitoUser';
import { UserDeviceSession } from '../models/UserDeviceSession';
import { CreateUserDeviceSessionDto } from '../models/dto/CreateUserDeviceSessionDto';
import { userDeviceSessionRepository } from '../repositories';
import { StoreUserSessionUseCase } from './interfaces/StoreUserSessionUseCase';

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
  ) => {
    const { tenant, username } = currentUser;
    const userId = `${tenant}#${username}`;
    const { token } = createSessionDto;
    // Check wether the device token exists in the database.
    // If it exists, return the existing user device session.
    const existingUserDeviceSession = await userDeviceSessionRepository
      .getByDeviceToken(userId, token);
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
      session,
    );

    if (!userDeviceSession) {
      throw new Error('Failed to create user device session');
    }

    return userDeviceSession;
  };
}
