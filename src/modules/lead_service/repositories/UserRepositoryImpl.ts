import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { User } from '../models/User';
import { dynamoProvider } from '../providers';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/constants';
import { UserRepository } from './interfaces/UserRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Get user attribute in dynamo db
   * @param username Cognito username
   * @returns User object
   */
  getUserAttributes = async (username: string): Promise<User | undefined> => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: travelTable,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk AND begins_with(pk, :pk_filter_value)',
      ExpressionAttributeValues: {
        // Given sk
        ':sk': { S: `${EMPLOYEE_INDEX}#${username}` },
        // Prefix to Tenant item
        ':pk_filter_value': { S: `${TENANT_INDEX}#` },
      },
    };
    const rs = await dynamoProvider.query(params);
    if (rs.length) {
      return rs[0];
    }
    return undefined;
  };
}
