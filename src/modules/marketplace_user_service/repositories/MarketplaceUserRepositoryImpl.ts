import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, QueryInput } from 'core';
import { MarketplaceUser, TravelUser } from '../models';
import { ROLE_STRING_DELIMITER, ROOT_ROLE, USER_INDEX } from '../utils/constants';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';

export default class MarketplaceUserRepositoryImpl implements MarketplaceUserRepository {
  getById = async (id: string) => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
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
    return users.map((user) => helper.excludeDataFromObject(user) as MarketplaceUser);
  };

  /**
   * Adds a new Marketplace user with specified roles.
   *
   * @param {TravelUser} user - The TravelUser object containing user information.
   * @param {string[]} roles - An array of roles associated with the user.
   * @returns {Promise<MarketplaceUser>} - A promise resolving to the added MarketplaceUser.
   */
  add = async (user: TravelUser, roles: string[]): Promise<MarketplaceUser> => {
    const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const pk = USER_INDEX;
    const sk = `${user.tenant}#${user.username}`;
    const now = Date.now();
    const marketplaceUser = {
      organization: user.tenant,
      username: user.username,
      name: `${user.lastName} ${user.firstName}`,
      id: sk,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      settings: user.settings,
      roles,
      roleStr: `${ROLE_STRING_DELIMITER}${roles.join(ROLE_STRING_DELIMITER)}${ROLE_STRING_DELIMITER}`,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    } as MarketplaceUser;

    // Add the Marketplace user to the DynamoDB table
    await dynamoProvider.putItem(table, pk, sk, marketplaceUser);

    // Return the added MarketplaceUser
    return helper.excludeDataFromObject(marketplaceUser) as MarketplaceUser;
  };

  /**
   * Updates a Marketplace user with new information.
   *
   * @param {string} id - The ID of the user to be updated.
   * @param {Partial<MarketplaceUser>} user - The partial MarketplaceUser object
   * with updated information.
   * @returns {Promise<MarketplaceUser>} - A promise resolving to the updated MarketplaceUser.
   */
  update = async (id: string, user: Partial<MarketplaceUser>): Promise<MarketplaceUser> => {
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
    return helper.excludeDataFromObject(result.Attributes as MarketplaceUser) as MarketplaceUser;
  };
}
