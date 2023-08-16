import { dynamoProvider, helper, QueryInput } from 'core';
import { getAwsSecretValue } from 'get-env';
import {
  DDBRole, GroupPermission, Permission, PermissionStatement, Role,
} from '../models';
import {
  DEFAULT_ROLES,
  PARTITION_KEY_DELIMITER,
  PERMISSION_INDEX,
  ROLE_INDEX,
  ROLE_PERMISSION_TABLE_KEY,
  ROOT_ROLE,
  TENANT_INDEX,
  WHITELIST_INDEX,
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
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
    const item = await dynamoProvider.getItem<DDBRole>(
      table,
      `${TENANT_INDEX}#${tenantId}`,
      `${ROLE_INDEX}#${roleName}`,
    );
    if (!item) return undefined;
    return {
      ...helper.excludeDataFromObject(item) as Role,
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
    logger.log(`Create role information Tenant: ${tenantId}, Role ${roleName}, Permissions: ${JSON.stringify(permissions)}`);

    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
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
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
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
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
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
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': `${TENANT_INDEX}#${tenantId}`,
        ':sk_filter': `${ROLE_INDEX}#`,
      },
    };
    const roles = await dynamoProvider.query(query);

    return roles.map((role) => {
      const [, roleName] = role.sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...helper.excludeDataFromObject(role),
        name: roleName,
      } as Role;
    });
  };

  /**
   * Get the list Default Role information
   * @returns Promise of list default Role
   */
  listDefaultRoles = async () => {
    logger.log('Get list default roles infomation');
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': `${ROLE_INDEX}`,
        ':sk_filter': `${ROLE_INDEX}#`,
      },
    };
    const roles = await dynamoProvider.query(query);

    return roles.map((role) => {
      const [, roleName] = role.sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...helper.excludeDataFromObject(role),
        name: roleName,
      } as Role;
    }).filter((item) => item.name !== ROOT_ROLE);
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
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);
    const pkFilter = whitelist ? `${PERMISSION_INDEX}#${WHITELIST_INDEX}` : `${PERMISSION_INDEX}`;
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': pkFilter,
        ':sk_filter': `${PERMISSION_INDEX}#`,
      },
    };

    const permissions = await dynamoProvider.query(query);

    const groupPermissions = permissions.map((permission) => {
      const [, groupPermissionName] = permission.sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...helper.excludeDataFromObject(permission),
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
   * @param permissionStatement The permission use to check
   * @returns boolean True if the user has permission or vice versa
   */
  hasPermission = async (
    tenantId: string,
    roles: Array<string>,
    permissionStatement: PermissionStatement,
  ) => {
    logger.log(`Check permission: Tenant ${tenantId}, Role: ${roles}, Permission: ${JSON.stringify(permissionStatement)}`);
    const table = await getAwsSecretValue(ROLE_PERMISSION_TABLE_KEY);

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
    )) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const promises = roles.map(async (role: string) => {
        const pk = DEFAULT_ROLES.includes(role) ? ROLE_INDEX : `${TENANT_INDEX}#${tenantId}`;
        const item = await dynamoProvider.getItem<DDBRole>(
          table,
          pk,
          `${ROLE_INDEX}#${role}`,
        );
        if (!item) {
          throw new Error(`Role [${role}] not found`);
        }
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
