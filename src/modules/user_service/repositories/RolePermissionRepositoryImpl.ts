import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { Role } from '../models';
import { PARTITION_KEY_DELIMITER, ROLE_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { RolePermissionRepository } from './interfaces/RolePermissionRepository';

export default class RolePermissionRepositoryImpl implements RolePermissionRepository {
  /**
   * Get the list Tenant Role information
   * @param tenantId The Tenant ID
   * @returns Promise of list Role
   */
  listRoles = async (tenantId: string) => {
    logger.log(`Get list role infomation: Tenant ${tenantId}}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const query = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': `${TENANT_INDEX}#${tenantId}`,
        ':sk_filter': `${ROLE_INDEX}#`,
      },
    };
    const items = await dynamoProvider.query(query);
    if (items.length === 0) {
      return [];
    }

    const roles = items.map((role) => {
      const {
        pk, sk, lsi1, lsi2, lsi3, lsi4, lsi5, ...rest
      } = role;
      const [, roleName] = sk.split(PARTITION_KEY_DELIMITER);
      return {
        ...rest,
        name: roleName,
      } as Role;
    });
    logger.log(`Get list role information: Found ${roles.length} roles`);
    return roles;
  };

  /**
   * Get the list Default Role information
   * @returns Promise of list default Role
   */
  listDefaultRoles = async () => {
    logger.log('Get list default roles infomation');
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const query = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': `${ROLE_INDEX}`,
        ':sk_filter': `${ROLE_INDEX}#`,
      },
    };
    const items = await dynamoProvider.query(query);
    if (items.length === 0) {
      return [];
    }

    const roles = items.map((role) => {
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
    return roles;
  };
}
