import { getAwsSecretValue } from 'get-env';
import {
  DDBRole,
} from '../models';
import { dynamoProvider } from '../providers';
import {
  DEFAULT_ROLES,
  ROLE_INDEX, TENANT_INDEX,
} from '../utils/constants';
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
  hasPermission = async (
    tenantId: string,
    roles: Array<string>,
    permissionName: string,
  ) => {
    logger.log(`Check permission: Tenant ${tenantId}, Role: ${roles}, Permission: ${permissionName}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');

    return new Promise<boolean>((resolve) => {
      const promises = roles.map(async (role: string) => {
        const pk = DEFAULT_ROLES.includes(role) ? ROLE_INDEX : `${TENANT_INDEX}#${tenantId}`;
        const item = await dynamoProvider.get<DDBRole>(
          table,
          pk,
          `${ROLE_INDEX}#${role}`,
        );
        if (!item) { throw new Error(`Role [${role}] not found`); }
        if (item.permissions.some(
          (element) => element.name === permissionName,
        )) {
          resolve(true);
        }
      });
      Promise.all(promises).then(() => resolve(false));
    });
  };
}
