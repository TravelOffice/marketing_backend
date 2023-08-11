import { dynamoProvider } from 'core';
import { getAwsSecretValue } from 'get-env';
import { DatabaseRepository } from './interfaces/DatabaseRepository';

export default class DatabaseRepositoryImpl implements DatabaseRepository {
  /**
   * Build batch write request for bookings
   * @param requests
   */
  executeBatchWrite = async (requests: {
    PutRequest: { Item: any }
  }[]) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.batchWriteItem({
      RequestItems: {
        [table]: requests,
      },
    });
  };
}
