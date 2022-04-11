import { getAwsSecretValue } from 'get-env';
import { User } from '../models/User';
import { dynamoProvider } from '../providers';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  getUserAttributes = async (userId: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem<User>(saleChatTable, `User#${userId}`, `User#${userId}`);
  };
}
