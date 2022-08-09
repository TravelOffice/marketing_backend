import { getAwsSecretValue } from 'get-env';
import { DDBRole, Permission } from '../models';
import { dynamoProvider } from '../providers';
import { ROLE_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';

export default class RolePermissionRepositoryImpl implements RolePermissionRepository {
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
