import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import {
  DynamoDBDocumentClient, GetCommand, GetCommandInput, PutCommand, PutCommandInput,
} from '@aws-sdk/lib-dynamodb';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEnv } from 'get-env';

const client = new DynamoDBClient({ region: getEnv('AWS_REGION') });
const docClient = DynamoDBDocumentClient.from(client);

export default class DynamoProvider {
  /**
   * Insert an item into the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @param data The data to be inserted.
   */
  putItem = async (table: string, pk: string, sk: string, data: any) => {
    const input: PutCommandInput = {
      TableName: table,
      Item: { pk, sk, ...data },
    };
    const command = new PutCommand(input);
    return docClient.send(command);
  };

  /**
   * Retrieve an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @returns The retrieved item if found, undefined otherwise.
   */
  getItem = async <T = any>(table: string, pk: string, sk: string) => {
    const input: GetCommandInput = {
      TableName: table,
      Key: { pk, sk },
    };
    const command = new GetCommand(input);
    const { Item } = await docClient.send(command);
    if (!Item) {
      return undefined;
    }
    return Item as T;
  };
}
