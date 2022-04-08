import { getAwsSecretValue } from 'get-env';
import { User } from '../models/User';
import { dynamoProvider } from '../providers';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Get user attribute in dynamo db
   * @param userId User Id
   * @returns User object
   */
  getUserAttributes = async (userId: string) => {
    const saleChatTable = await getAwsSecretValue('SALE_CHAT_TABLE');
    return dynamoProvider.getItem<User>(saleChatTable, `User#${userId}`, `User#${userId}`);
  };
}
