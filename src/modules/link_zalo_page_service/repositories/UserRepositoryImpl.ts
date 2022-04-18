import * as AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { User } from '../models/User';
import { dynamoProvider } from '../providers';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  getUserAttributes = async (userId: string) => {
    const saleChatTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const result = await dynamoProvider.query({
      TableName: saleChatTable,
      KeyConditionExpression: 'begins_with(pk, :pk_tenant) AND sk = :sk_employee',
      ExpressionAttributeValues: {
        ':pk_tenant': { S: 'Tenant' },
        ':sk_employee': { S: `Employee#${userId}` },
      },
      IndexName: 'ReverseIndex',
    });
    if (!result.Items || result.Items.length === 0) {
      return undefined;
    }
    const userAttributes = AWS.DynamoDB.Converter.unmarshall(result.Items[0]) as User;
    return userAttributes;
  };
}
