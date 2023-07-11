import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, QueryInput } from 'core';
import { User } from '../models/User';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';
import logger from '../utils/logger';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object from userId
   * @param tenantId Tenant ID
   * @param userId User ID
   * @returns Promise of User
   */
  getUserAttributes = async (tenantId: string, userId: string) => {
    const ddbTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem<User>(
      ddbTable,
      `${TENANT_INDEX}#${tenantId}`,
      `${EMPLOYEE_INDEX}#${userId}`,
    );
  };

  listByRole = async (tenantId: string, role: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}`,
        ':sk_filter': `${EMPLOYEE_INDEX}#`,
      },
    };

    const result: User[] = await dynamoProvider.query(params);

    const users = result.filter((user: User) => user.roles.includes(role));

    // Logging the results
    logger.log(`Found ${users.length} users with role ${role} for tenant ${tenantId}`);
    logger.log(`${role} users:`, users);

    return users;
  };
}
