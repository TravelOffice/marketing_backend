import { getAwsSecretValue } from 'get-env';
import { User } from '../models';
import { dynamoProvider } from '../providers';
import {
  EMPLOYEE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object
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

  /**
   * Function used to get users by role
   * @param tenantId  Tenant ID
   * @param roleName Role name that will be filted
   * @returns
   */
  getUsersByRole = async (tenantId: string, roleName: string) => {
    const ddbTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: ddbTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        // Given page id
        ':pk': { S: `${TENANT_INDEX}#${tenantId}` },
        // Prefix to Facebook item
        ':sk_filter_value': { S: EMPLOYEE_INDEX },
        ':role_filter_value': { S: `#${roleName}#` },
      },
      FilterExpression: 'contains(roleStr, :role_filter_value)',
      ProjectionExpression: 'username',
    };
    return dynamoProvider.query(params);
  };
}
