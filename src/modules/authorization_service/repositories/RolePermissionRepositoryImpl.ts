import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import {
  DDBRole, GroupPermission, Permission, PermissionStatement, Role,
} from '../models';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  DEFAULT_ROLES,
  PARTITION_KEY_DELIMITER, PERMISSION_INDEX, ROLE_INDEX, ROOT_ROLE, TENANT_INDEX, WHITELIST_INDEX,
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
      pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
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
 * Method to update Tenant role
 * @param tenantId The id of the Tenant which the user should belong to
 * @param roleName The role name to be updated
 * @param permissions The permissions which belong to a role to be updated
 * @returns Promise<Role> All information of updated role
 */
  updateRole = async (tenantId: string, roleName: string, permissions: Permission[]) => {
    logger.log(`Update role infomation Tenant: ${tenantId}, Role ${roleName}, Permissions: ${JSON.stringify(permissions)}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${ROLE_INDEX}#${roleName}`;
    const currentTime = Date.now();
    await dynamoProvider.updateItemWithSetExpression(
      table,
      pk,
      sk,
      {
        permissions,
        updatedAt: currentTime,
      },
    );
    return {
      name: roleName,
      permissions,
    };
  };

  /**
 * Method to delete Tenant role
 * @param tenantId The id of the Tenant which the user should belong to
 * @param roleName The role name to be deleted
 * @returns Promise<void>
 */
  deleteRole = async (tenantId: string, roleName: string) => {
    logger.log(`Delete role infomation Tenant: ${tenantId}, Role ${roleName}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${ROLE_INDEX}#${roleName}`;
    await dynamoProvider.deleteItem(table, pk, sk);
  };

  /**
   * Get the list Tenant Role information
   * @param tenantId The Tenant ID
   * @returns Promise of list Role
   */
  listRoles = async (tenantId: string) => {
    logger.log(`Get list role infomation: Tenant ${tenantId}`);
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
        pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
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
 * Get the list Default Role information
 * @returns Promise of list default Role
 */
  listDefaultRoles = async () => {
    logger.log('Get list default roles infomation');
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${ROLE_INDEX}` },
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
        pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
      } = role;
      const [, roleName] = sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...rest,
        name: roleName,
      } as Role;
    });
    logger.log(`Get list default roles infomation: Found ${roles.length} roles`);
    // Remove ROOT role before return to web client.
    return roles.filter((role: Role) => role.name !== ROOT_ROLE);
  };

  /**
   * Get all permissions information
   * @returns Promise of all Permissions
   */
  listPermissions = async () => {
    logger.log('Get list permission infomation');
    const groupPermissions = await this.listGroupPermissions();
    return groupPermissions
      .map((groupPermission: GroupPermission) => groupPermission.permissions)
      .flat();
  };

  /**
   * Get all whitelist permissions information
   * @returns Promise of all Permissions
   */
  listWhitelistPermissions = async () => {
    logger.log('Get list permission infomation');
    const groupPermissions = await this.listGroupPermissions(true);
    return groupPermissions
      .map((groupPermission: GroupPermission) => groupPermission.permissions)
      .flat();
  };

  /**
   * Get all permissions information
   * @param whitelist Flag to check whether to get the list whitelist permission or not
   * @returns Promise of all Permissions
   */
  listGroupPermissions = async (whitelist?: boolean) => {
    logger.log('Get list group permission infomation');
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const pkFilter = whitelist ? `${PERMISSION_INDEX}#${WHITELIST_INDEX}` : `${PERMISSION_INDEX}`;
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: pkFilter },
        ':sk_filter': { S: `${PERMISSION_INDEX}#` },
      },
    };

    const { Items: items } = await dynamoProvider.rawQuery(query);
    if (!items || items.length === 0) {
      return [];
    }

    const groupPermissions = items.map((item) => {
      const groupPermission = AWS.DynamoDB.Converter.unmarshall(item);
      const {
        pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
      } = groupPermission;
      const [, groupPermissionName] = sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...rest,
        name: groupPermissionName,
      } as GroupPermission;
    });
    logger.log(`Get list group permissions infomation: Found ${groupPermissions.length} permissions`);
    return groupPermissions;
  };

  /**
   * Check whether user has permission to access ApiGateway or AppSync resource
   * @param tenantId The Tenant ID
   * @param roles The list of current user role
   * @param permission The permission use to check
   * @returns boolean True if the user has permission or vice versa
   */
  hasPermission = async (
    tenantId: string,
    roles: Array<string>,
    permissionStatement: PermissionStatement,
  ) => {
    logger.log(`Check permission: Tenant ${tenantId}, Role: ${roles}, Permission: ${JSON.stringify(permissionStatement)}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');

    const includedStatement = (
      statements: PermissionStatement[],
    ) => statements.some(
      (statement) => statement.path === permissionStatement.path
        && statement.action === permissionStatement.action,
    );

    // Check the whitelist permission
    const whitelistPermissions = await this.listWhitelistPermissions();
    if (whitelistPermissions.some(
      (element: Permission) => includedStatement(element.statements),
    )) { return true; }

    return new Promise<boolean>((resolve) => {
      const promises = roles.map(async (role: string) => {
        const pk = DEFAULT_ROLES.includes(role) ? ROLE_INDEX : `${TENANT_INDEX}#${tenantId}`;
        const item = await dynamoProvider.getItem<DDBRole>(
          table,
          pk,
          `${ROLE_INDEX}#${role}`,
        );
        if (!item) { throw new Error(`Role [${role}] not found`); }
        if (item.permissions.some(
          (element) => includedStatement(element.statements),
        )) {
          resolve(true);
        }
      });
      Promise.all(promises).then(() => resolve(false));
    });
  };
}
