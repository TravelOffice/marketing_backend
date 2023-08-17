import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { Permission, Role } from '../models';
import {
  DEFAULT_ROLES,
  MARKETPLACE_TABLE_KEY,
  ROLE_INDEX,
  ROLE_PERMISSION_TABLE_KEY,
  TENANT_INDEX,
  USER_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { UserRepository } from './interfaces/UserRepository';
import { MarketplaceUser } from '../models/MarketplaceUser';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object
   * @param tenantId Tenant ID
   * @param userId User ID
   * @returns Promise of User
   */
  getUserAttributes = async (tenantId: string, userId: string) => {
    const ddbTable = await getAwsSecretValue(MARKETPLACE_TABLE_KEY);
    return dynamoProvider.getItem<MarketplaceUser>(
      ddbTable,
      USER_INDEX,
      `${tenantId}#${userId}`,
    );
  };

  /**
   * Function used to get users by role
   * @param tenantId  Tenant ID
   * @param roleName Role name that will be filted
   * @returns
   */
  getUsersByRole = async (tenantId: string, roleName: string) => {
    const ddbTable = await getAwsSecretValue(MARKETPLACE_TABLE_KEY);
    const params = {
      TableName: ddbTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': USER_INDEX,
        ':sk_filter_value': `${tenantId}#`,
        ':role_filter_value': `#${roleName}#`,
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
  getUserPermissions = async (tenantId: string, user: MarketplaceUser) => {
    logger.log(`Tenant: ${tenantId}, User: ${user.username}`);
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
    const { roles } = user;
    const permissions: Array<string> = [];
    await Promise.all(roles.map(async (role) => {
      const pk = DEFAULT_ROLES.includes(role) ? ROLE_INDEX : `${TENANT_INDEX}#${tenantId}`;
      const item = await dynamoProvider.getItem<Role>(
        table,
        pk,
        `${ROLE_INDEX}#${role}`,
      );
      if (!item) {
        throw new Error(`Role [${role}] not found`);
      }
      item.permissions.forEach((permission: Permission) => {
        permissions.push(permission.name);
      });
    }));

    // Remove duplicated permission
    return [...new Set(permissions)];
  };
}
