import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import { UserRepository } from './interfaces/UserRepository';
import { User } from '../models/User';
import { QueryInput } from '../providers/DynamoProvider';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';

export default class UserRepositoryImpl implements UserRepository {
  getUserAttributes = async (userId: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const query: QueryInput = {
      TableName: saleChatTable,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_employee AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${TENANT_INDEX}#` },
        ':sk_employee': { S: `${EMPLOYEE_INDEX}#${userId}` },
      },
    };
    const queryResult = await dynamoProvider.rawQuery(query);
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return undefined;
    }
    return AWS.DynamoDB.Converter.unmarshall(queryResult.Items[0]) as User;
  };

  list = async () => {
    throw new Error('Method not implemented!');
  };

  get = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };

  create = async (user: User) => {
    console.log(user);
    throw new Error('Method not implemented!');
  };

  update = async (id: string | number, user: User) => {
    console.log(id, user);
    throw new Error('Method not implemented!');
  };

  delete = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };
}
