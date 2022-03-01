import { User } from '../models/User';
import { dynamoProvider } from '../providers';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  getUserAttributes = async (userId: string) => dynamoProvider.getItem<User>('dev-sale_chat', `User#${userId}`, `User#${userId}`);
}
