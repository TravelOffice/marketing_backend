import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, QueryInput } from 'core';
import { BatchWriteItemInput } from 'core/providers/dynamodb/DynamoProvider';
import { MarketplaceUser, UserWithRoles } from '../models';
import {
  ROLE_STRING_DELIMITER,
  ROOT_ROLE,
  USER_INDEX,
} from '../utils/constants';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';

export default class MarketplaceUserRepositoryImpl
implements MarketplaceUserRepository {
  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue(
      'DYNAMO_MARKETPLACE_TABLE',
    );
    const marketplaceUser = await dynamoProvider.getItem<MarketplaceUser>(
      marketplaceTable,
      USER_INDEX,
      id,
    );
    if (!marketplaceUser) return undefined;
    return helper.excludeDataFromObject(marketplaceUser) as MarketplaceUser;
  };

  /**
   * Method to get all users belong to Tenant except ROOT account
   * @param organization The id of the Organization which the user should belong to
   * @returns Promise<Array<MarketplaceUser>> The list of users
   */
  list = async (organization: string) => {
    const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': USER_INDEX,
        ':sk_filter': `${organization}#`,
        ':root_role': ROOT_ROLE,
      },
      FilterExpression: 'not contains(roleStr, :root_role)',
    };
    const users = await dynamoProvider.query(params);
    return users.map(
      (user) => helper.excludeDataFromObject(user) as MarketplaceUser,
    );
  };

  /**
   * Adds a new Marketplace user with specified roles.
   * @param tenant The ID of tenant
   * @param {UserWithRoles} user - The TravelUser object containing user information.
   * @returns {Promise<MarketplaceUser>} - A promise resolving to the added MarketplaceUser.
   */
  addUser = async (
    tenant: string,
    user: UserWithRoles,
  ): Promise<MarketplaceUser> => {
    const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const pk = USER_INDEX;
    const sk = `${tenant}#${user.username}`;
    const now = Date.now();
    const marketplaceUser = {
      organization: user.tenant,
      username: user.username,
      name: `${user.lastName} ${user.firstName}`,
      id: sk,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      settings: user.settings,
      roles: user.roles,
      roleStr: `${ROLE_STRING_DELIMITER}${user.roles.join(
        ROLE_STRING_DELIMITER,
      )}${ROLE_STRING_DELIMITER}`,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    } as MarketplaceUser;

    // Add the Marketplace user to the DynamoDB table
    await dynamoProvider.putItem(table, pk, sk, marketplaceUser);

    // Return the added MarketplaceUser
    return helper.excludeDataFromObject(marketplaceUser) as MarketplaceUser;
  };

  addUsers = (tenant: string, users: UserWithRoles[]) => {
    // Split huge array to smaller chucks
    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < users.length; i += chunkSize) {
      chunks.push(users.slice(i, i + chunkSize));
    }
    // Execute batch write
    const marketplaceUserChunks = Promise.all(
      chunks.map(async (chunk) => {
        // Build marketplace users
        const marketplaceUsers = this.buildBatchWriteUser(tenant, chunk);
        // Execute batch write users
        await this.executeBatchWrite(marketplaceUsers);
        // Return the added MarketplaceUser
        return marketplaceUsers.map(
          (marketplaceUser) => helper.excludeDataFromObject(marketplaceUser) as MarketplaceUser,
        );
      }),
    );
    return marketplaceUserChunks.then((chunkRs) => chunkRs.flat());
  };

  private executeBatchWrite = async <T>(param: T[]) => {
    const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const requests = param.map((item) => ({
      PutRequest: { Item: item },
    }));
    const RequestItems = {
      RequestItems: {
        [table]: requests,
      },
    } as BatchWriteItemInput;
    return dynamoProvider.batchWriteItem(RequestItems);
  };

  /**
   * Write batch `TravelUser` to `MarketplaceUser`
   * @param tenant The ID of tenant
   * @param users Travel users
   * @returns {<MarketplaceUser[]>} A promise resolving to the added MarketplaceUsers
   */
  private buildBatchWriteUser = (tenant: string, users: UserWithRoles[]): MarketplaceUser[] => {
    // Construct the partition key for customers
    const pk = 'USR';

    // Default user enable = true
    const userEnabled = true;

    // Build TravelUsers with Roles to MarketUsers
    return users.map((user) => {
      // Construct the sort key for the customer
      const sk = `${tenant}#${user.username}`;
      // Get the current timestamp
      const now = Date.now();
      // Construct the Item object for the PutRequest
      return {
        ...user,
        pk,
        sk,
        id: sk,
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        organization: tenant,
        enabled: userEnabled,
        lsi1: `${userEnabled}#${now}`,
        createdAt: now,
        updatedAt: now,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        settings: user.settings,
        roles: user.roles,
        roleStr: `${ROLE_STRING_DELIMITER}${user.roles.join(
          ROLE_STRING_DELIMITER,
        )}${ROLE_STRING_DELIMITER}`,
      };
    });
  };

  /**
   * Updates a Marketplace user with new information.
   *
   * @param {string} id - The ID of the user to be updated.
   * @param {Partial<MarketplaceUser>} user - The partial MarketplaceUser object
   * with updated information.
   * @returns {Promise<MarketplaceUser>} - A promise resolving to the updated MarketplaceUser.
   */
  update = async (
    id: string,
    user: Partial<MarketplaceUser>,
  ): Promise<MarketplaceUser> => {
    // Generate update expression names and values
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(user);

    // Perform raw update using DynamoDB provider
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: USER_INDEX,
        sk: id,
      },
      UpdateExpression: helper.generateUpdateExpression(user),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });

    // Return the updated MarketplaceUser
    return helper.excludeDataFromObject(
      result.Attributes as MarketplaceUser,
    ) as MarketplaceUser;
  };
}
