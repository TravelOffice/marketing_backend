import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Role } from '../models/RolePermission';
import { User, UserWithPermission } from '../models/User';
import { authProvider, dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  EMPLOYEE_INDEX, ENABLED, ROLE_INDEX, TENANT_INDEX, USERNAME_DELIMITER,
} from '../utils/constants';
import logger from '../utils/logger';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object from userId
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
   * Method to get all user belong to Tenant
   * @param tenantId The id of the Tenant which the user should belong to
   * @returns Promise<Array<User>> The list of users
   */
  list = async (tenantId: string) => {
    logger.log(`Tenant: ${tenantId}`);
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const query: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk_filter AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${TENANT_INDEX}#${tenantId}` },
        ':sk_filter': { S: `${EMPLOYEE_INDEX}#` },
      },
    };
    const { Items: items } = await dynamoProvider.rawQuery(query);
    if (!items || items.length === 0) {
      return [];
    }

    const users = items.map((item) => {
      const user = AWS.DynamoDB.Converter.unmarshall(item);
      const {
        pk, sk, typeLsi, ...rest
      } = user;
      return rest as User;
    });
    logger.log(`Found ${users.length} users`);
    return users;
  };

  /**
   * Method to get single user belong to Tenant which determine by userId
   * @param tenantId The id of the Tenant which the user should belong to
   * @param userId The id of the user
   * @returns Promise<User> All information of User object
   */
  get = async (tenantId: string, userId: string) => {
    logger.log(`Tenant: ${tenantId}, User: ${userId}`);
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}`,
      `${EMPLOYEE_INDEX}#${userId}`,
    );
    const {
      pk, sk, typeLsi, ...user
    } = item;

    return user;
  };

  /**
   * Method to get single use belong to Tenant which determine by userId with permission
   * @param tenantId The id of the Tenant which the user should belong to
   * @param userId The id of the user
   * @returns Promise<User> All information of User object with permission
   */
  getWithPermission = async (tenantId: string, userId: string) => {
    logger.log(`Tenant: ${tenantId}, User: ${userId}`);
    const table = await getAwsSecretValue('DYNAMO_ROLE_PERMISSION_TABLE');
    const user : User = await this.get(tenantId, userId);
    const { roles } = user;
    let permissions : Array<string> = [];
    await Promise.all(roles.map(async (role) => {
      const item = await dynamoProvider.getItem<Role>(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${ROLE_INDEX}#${role}`,
      );
      if (!item) { throw new Error(`Role [${role}] not found`); }
      item.permissions.forEach((permission) => {
        if (permission.name) permissions.push(permission.name);
      });
    }));

    // Remove dupplicated permission
    permissions = [...new Set(permissions)];

    return { ...user, permissions } as UserWithPermission;
  };

  /**
   * Method to create Tenant user
   * To create Tenant user, there are steps need to do:
   * - Step 1: Create the user information in AuthProvider
   * - Step 2: Create the user information in Dynamo DB
   * @param tenantId The id of the Tenant which the user should belong to
   * @param user The user information to be created
   * @returns Promise<User> All information of created user
   */
  create = async (tenantId: string, user: User) => {
    logger.log(`Tenant: ${tenantId}, User: ${JSON.stringify(user)}`);
    // Create AuthProvider user
    await authProvider.adminCreateUser({
      ...user,
      username: `${tenantId}${USERNAME_DELIMITER}${user.username}`,
    });

    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${EMPLOYEE_INDEX}#${user.username}`;
    // TODO: Need to be implement more user status to filter
    const typeLsi = `${EMPLOYEE_INDEX}#${ENABLED}`;
    const currentTime = Date.now();
    await dynamoProvider.putItem(table, pk, sk, {
      ...user,
      createdAt: currentTime,
      updatedAt: currentTime,
      typeLsi,
    });
    return user;
  };

  /**
   * Method to update Tenant user
   * To update Tenant user, there are steps need to do:
   * - Step 1: Update the user information in AuthProvider
   * - Step 2: Update the user information in Dynamo DB
   * @param tenantId The id of the Tenant which the user should belong to
   * @param user The user information to be updated
   * @returns Promise<User> All information of updated user
   */
  update = async (tenantId: string, user: User) => {
    logger.log(`Tenant: ${tenantId}, User: ${JSON.stringify(user)}`);
    // Update AuthProvider user
    await authProvider.adminUpdateUser({
      ...user,
      username: `${tenantId}${USERNAME_DELIMITER}${user.username}`,
    });

    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.putItem(
      table,
      `${TENANT_INDEX}#${tenantId}`,
      `${EMPLOYEE_INDEX}#${user.username}`,
      {
        ...user,
        updatedAt: Date.now(),
      },
    );

    return user;
  };

  delete = async (tenantId: string, userId: string) => {
    logger.log(`Tenant: ${tenantId}, User: ${userId}`);
    throw new Error('Method not implemented!');
  };
}
