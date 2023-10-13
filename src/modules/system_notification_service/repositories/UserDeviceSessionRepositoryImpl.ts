import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { AppType, UserDeviceSession } from '../models/UserDeviceSession';
import { UserDeviceSessionRepository } from './interfaces/UserDeviceSessionRepository';
import { USER_SESSION_INDEX, USERNAME_INDEX } from '../utils/constants';

const excludeKeys = [
  'pk',
  'sk',
  'lsi1',
  'lsi2',
  'lsi3',
  'lsi4',
  'lsi5',
] as (keyof UserDeviceSession)[];

export class UserDeviceSessionRepositoryImpl implements UserDeviceSessionRepository {
  create = async (
    userId: string,
    type: AppType,
    userDeviceSession: UserDeviceSession,
  ): Promise<UserDeviceSession | undefined> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const pk = `${USERNAME_INDEX}#${userId}#${USER_SESSION_INDEX}`;
    const sk = `${type}#${userDeviceSession.token}`;
    await dynamoProvider.putItem(table, pk, sk, userDeviceSession);
    return userDeviceSession;
  };

  listByUser = async (
    userId: string,
    appType: AppType,
  ): Promise<UserDeviceSession[]> => {
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const queryParams = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': `${USERNAME_INDEX}#${userId}#${USER_SESSION_INDEX}`,
        ':sk': `${appType}#`,
      },
    };

    const sessions = await dynamoProvider.query<UserDeviceSession>(queryParams);
    return sessions.map((item) => helper.excludeDataFromObject(item) as UserDeviceSession);
  };

  getByDeviceToken = async (
    userId: string,
    appType: AppType,
    deviceToken: string,
  ): Promise<UserDeviceSession | undefined> => {
    // Retrieve the UserDeviceSession from the DynamoDB table
    const table = await getAwsSecretValue('DYNAMO_NOTIFICATION_TABLE');
    const tourPost = await dynamoProvider.getItem<UserDeviceSession>(
      table,
      `${USERNAME_INDEX}#${userId}#${USER_SESSION_INDEX}`,
      `${appType}#${deviceToken}`,
    );

    // If the UserDeviceSession doesn't exist, return undefined
    if (!tourPost) {
      return undefined;
    }

    return helper.excludeDataFromObject(tourPost, excludeKeys) as UserDeviceSession;
  };
}
