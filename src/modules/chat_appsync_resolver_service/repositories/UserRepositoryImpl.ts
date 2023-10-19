import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { User } from '../models';
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
}
