import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { TravelUserRepository } from './interfaces/TravelUserRepository';
import { TravelUser } from '../models';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';

export default class TravelUserRepositoryImpl implements TravelUserRepository {
  get = async (tenant: string, username: string): Promise<TravelUser | undefined> => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const user = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenant}`,
      `${EMPLOYEE_INDEX}#${username}`,
    );
    if (!user) return undefined;
    return helper.excludeDataFromObject(user) as TravelUser;
  };
}
