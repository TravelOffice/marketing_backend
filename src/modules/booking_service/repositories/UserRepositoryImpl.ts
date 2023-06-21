import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';
import { User } from '../models/User';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object from userId
   * @param userId User ID
   * @returns Promise of User
   */
  getUserAttributes = async (userId: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const queryParams: QueryInput = {
      TableName: saleChatTable,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_employee AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${TENANT_INDEX}#` },
        ':sk_employee': { S: `${EMPLOYEE_INDEX}#${userId}` },
      },
    };
    const { Items: items } = await dynamoProvider.query(queryParams);
    if (!items || items.length === 0) {
      return undefined;
    }
    return items.pop() as User;
  };
}
