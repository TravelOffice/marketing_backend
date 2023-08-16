import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper, QueryInput } from 'core';
import { MarketplaceUser, User } from '../models';
import { ROOT_ROLE, USER_INDEX } from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Method to get all users belong to Tenant except ROOT account
   * @param tenantId The id of the Tenant which the user should belong to
   * @returns Promise<Array<MarketplaceUser>> The list of users
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter)',
      ExpressionAttributeValues: {
        ':pk': USER_INDEX,
        ':sk_filter': `${tenantId}#`,
        ':root_role': ROOT_ROLE,
      },
      FilterExpression: 'not contains(roleStr, :root_role)',
    };
    const users = await dynamoProvider.query(params);
    return users.map((user) => helper.excludeDataFromObject(user) as MarketplaceUser);
  };

  add(user: User): Promise<MarketplaceUser> {
    throw new Error(`Function isn't implemented: ${user}`);
  }

  remove(id: string): Promise<void> {
    throw new Error(`Function isn't implemented: ${id}`);
  }

  update(user: MarketplaceUser): Promise<MarketplaceUser> {
    throw new Error(`Function isn't implemented: ${user}`);
  }
}
