import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { DDBRole, Permission, Role } from '../models';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  PARTITION_KEY_DELIMITER, PERMISSION_INDEX, ROLE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';

export default class RolePermissionRepositoryImpl implements RolePermissionRepository {
  /**
   * Get the Tenant Role information
   * @param tenantId The Tenant ID
   * @param roleName The list of current user role
   * @returns Promise of Role or undefined
   */
  getRole = async (tenantId: string, roleName: string) => {
    logger.log(`Get role infomation: Tenant ${tenantId}, Role: ${roleName}}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const item = await dynamoProvider.getItem<DDBRole>(
      table,
      `${TENANT_INDEX}#${tenantId}`,
      `${ROLE_INDEX}#${roleName}`,
    );
    if (!item) return undefined;
    const {
      pk, sk, typeLsi, ...rest
    } = item;
    return {
      ...rest,
      name: roleName,
    };
  };

  /**
   * Method to create Tenant role
   * @param tenantId The id of the Tenant which the user should belong to
   * @param roleName The role name to be created
   * @param permissions The permissions which belong to a role to be created
   * @returns Promise<Role> All information of created role
   */
  createRole = async (tenantId: string, roleName: string, permissions: Permission[]) => {
    logger.log(`Create role infomation Tenant: ${tenantId}, Role ${roleName}, Permissions: ${JSON.stringify(permissions)}`);

    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${ROLE_INDEX}#${roleName}`;
    const currentTime = Date.now();

    await dynamoProvider.putItem(table, pk, sk, {
      permissions,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
    return {
      name: roleName,
      permissions,
    };
  };

  /**
   * Get the list Tenant Role information
   * @param tenantId The Tenant ID
   * @returns Promise of list Role
   */
  listRoles = async (tenantId: string) => {
    logger.log(`Get list role infomation: Tenant ${tenantId}}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: `${ROLE_INDEX}#` },
      },
    };
    const { Items: items } = await dynamoProvider.rawQuery(query);
    if (!items || items.length === 0) {
      return [];
    }

    const roles = items.map((item) => {
      const role = AWS.DynamoDB.Converter.unmarshall(item);
      const {
        pk, sk, typeLsi, ...rest
      } = role;
      const [, roleName] = sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...rest,
        name: roleName,
      } as Role;
    });
    logger.log(`Get list role infomation: Found ${roles.length} roles`);
    return roles;
  };

  /**
   * Get all permissions information
   * @returns Promise of all Permission
   */
  listPermissions = async () => {
    logger.log('Get list permission infomation');
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${PERMISSION_INDEX}` },
        ':sk_filter': { S: `${PERMISSION_INDEX}#` },
      },
    };

    const { Items: items } = await dynamoProvider.rawQuery(query);
    if (!items || items.length === 0) {
      return [];
    }

    const permission = items.map((item) => {
      const role = AWS.DynamoDB.Converter.unmarshall(item);
      const {
        pk, sk, typeLsi, ...rest
      } = role;
      const [, permissionName] = sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...rest,
        name: permissionName,
      } as Permission;
    });
    logger.log(`Get list permission infomation: Found ${permission.length} permissions`);
    return permission;
  };

  /**
   * Check whether user has permission to access ApiGateway or AppSync resource
   * @param tenantId The Tenant ID
   * @param roles The list of current user role
   * @param permission The permission use to check
   * @returns boolean True if the user has permission or vice versa
   */
  hasPermission = async (tenantId: string, roles: Array<string>, permission: Permission) => {
    logger.log(`Check permission: Tenant ${tenantId}, Role: ${roles}, Permission: ${JSON.stringify(permission)}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');

    return new Promise<boolean>((resolve) => {
      const promises = roles.map(async (role) => {
        const item = await dynamoProvider.getItem<DDBRole>(
          table,
          `${TENANT_INDEX}#${tenantId}`,
          `${ROLE_INDEX}#${role}`,
        );
        if (!item) { throw new Error(`Role [${role}] not found`); }
        if (item.permissions.some(
          (element) => element.path === permission.path && element.action === permission.action,
        )) {
          resolve(true);
        }
      });
      Promise.all(promises).then(() => resolve(false));
    });
  };
}
