import { getAwsSecretValue } from 'get-env';
import { QueryInput, dynamoProvider, helper } from 'core';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';
import { User } from '../models/User';

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
    const users = await dynamoProvider.query(queryParams);
    if (users.length === 0) {
      return undefined;
    }

    // Formatting the item
    return helper.excludeDataFromObject(users.pop()) as User;
  };
}
