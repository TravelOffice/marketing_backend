import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { User } from '../models/User';
import { dynamoProvider } from '../providers';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object from userId
   * @param userId User ID
   * @returns Promise of User
   */
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
    const { Items: items } = await dynamoProvider.rawQuery(query);
    if (!items || items.length === 0) {
      return undefined;
    }
    return AWS.DynamoDB.Converter.unmarshall(items[0]) as User;
  };
}
