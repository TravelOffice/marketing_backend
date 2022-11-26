import { getAwsSecretValue } from 'get-env';
import { Role, User } from '../models';
import { dynamoProvider } from '../providers';
import {
  DEFAULT_ROLES,
  EMPLOYEE_INDEX, ROLE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
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
        ':pk': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter_value': { S: EMPLOYEE_INDEX },
        ':role_filter_value': { S: `#${roleName}#` },
      },
      FilterExpression: 'contains(roleStr, :role_filter_value)',
      ProjectionExpression: 'username',
    };
    return dynamoProvider.query(params);
  };

  /**
   * Method to get all user permissions
   * @param tenantId The id of the Tenant which the user should belong to
   * @param user The information of the user
   * @returns Promise<User> All information of User object with permission
   */
  getUserPermissions = async (tenantId: string, user: User) => {
    logger.log(`Tenant: ${tenantId}, User: ${user.username}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const { roles } = user;
    const permissions : Array<string> = [];
    await Promise.all(roles.map(async (role) => {
      const pk = DEFAULT_ROLES.includes(role) ? ROLE_INDEX : `${TENANT_INDEX}#${tenantId}`;
      const item = await dynamoProvider.getItem<Role>(
        table,
        pk,
        `${ROLE_INDEX}#${role}`,
      );
      if (!item) { throw new Error(`Role [${role}] not found`); }
      item.permissions.forEach((permission) => {
        permissions.push(permission.name);
      });
    }));

    // Remove dupplicated permission
    return [...new Set(permissions)];
  };
}
