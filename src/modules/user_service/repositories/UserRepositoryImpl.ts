import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, authProvider } from '../providers';
import { UserRepository } from './interfaces/UserRepository';
import { User } from '../models/User';
import { QueryInput } from '../providers/DynamoProvider';
import {
  EMPLOYEE_INDEX, ENABLED, TENANT_INDEX, USERNAME_DELIMITER,
} from '../utils/constants';
import logger from '../utils/logger';

export default class UserRepositoryImpl implements UserRepository {
  getUserAttributes = async (userId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const query: QueryInput = {
      TableName: table,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_employee AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':pk_filter': { S: `${TENANT_INDEX}#` },
        ':sk_employee': { S: `${EMPLOYEE_INDEX}#${userId}` },
      },
    };
    const queryResult = await dynamoProvider.rawQuery(query);
    if (!queryResult.Items || queryResult.Items.length === 0) {
      return undefined;
    }
    return AWS.DynamoDB.Converter.unmarshall(queryResult.Items[0]) as User;
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
