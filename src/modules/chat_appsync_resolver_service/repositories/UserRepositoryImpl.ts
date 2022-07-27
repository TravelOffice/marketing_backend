import { getAwsSecretValue } from 'get-env';
import { ROLES_TYPE } from '../models';
import { dynamoProvider } from '../providers';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';
import logger from '../utils/logger';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Method to check whether the user is root|admin account or not
   * @param tenantId The id of the Tenant which the user should belong to
   * @param userId The id of the user
   * @returns Promise<bool> True if user is tenant root|admin account
   */
  isRootOrAdmin = async (tenantId: string, userId: string) => {
    logger.log(`Tenant: ${tenantId}, User: ${userId}`);
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    const item = await dynamoProvider.get(
      table,
      `${TENANT_INDEX}#${tenantId}`,
      `${EMPLOYEE_INDEX}#${userId}`,
    );
    const {
      pk, sk, typeLsi, ...user
    } = item;

    const userRole = user.role;

    return userRole === ROLES_TYPE.ROOT || userRole === ROLES_TYPE.ADMIN;
  };
}
