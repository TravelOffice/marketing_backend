import AWS from 'aws';
import { getEnv } from 'get-env';

export type PutItemInput = AWS.DynamoDB.DocumentClient.PutItemInput;
export type GetItemInput = AWS.DynamoDB.DocumentClient.GetItemInput;
export type UpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;
export type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;
export type DeleteItemInput = AWS.DynamoDB.DocumentClient.DeleteItemInput;

const dynamoDB: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient({ region: getEnv('AWS_REGION') });

export default class DynamoProvider {
  /**
   * Insert an item into the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @param data The data to be inserted.
   */
  putItem = async (table: string, pk: string, sk: string, data: any) => {
    const params: PutItemInput = {
      TableName: table,
      Item: { pk, sk, ...data },
    };
    return dynamoDB.put(params).promise();
  };

  /**
   * Retrieve an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @returns The retrieved item if found, undefined otherwise.
   */
  getItem = async <T = any>(table: string, pk: string, sk: string): Promise<T | undefined> => {
    const params: GetItemInput = {
      TableName: table,
      Key: { pk, sk },
    };
    const { Item } = await dynamoDB.get(params).promise();
    if (!Item) {
      return undefined;
    }
    return Item as T;
  };

  /**
   * Perform a query on the DynamoDB table.
   * @param params The query parameters.
   * @returns An array of items matching the query.
   */
  query = async <T = any>(params: QueryInput): Promise<T[]> => {
    const { Items } = await dynamoDB.query(params).promise();
    if (Items) {
      return Items as T[];
    }
    return [];
  };

  /**
   * Update an item in the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @param updateExpression The update expression.
   * @param expressionAttributeValues The attribute values used in the update expression.
   * @param expressionAttributeNames Optional. The attribute names used in the update expression.
   * @returns The updated item.
   */
  updateItem = async (
    table: string,
    pk: string,
    sk: string,
    updateExpression: string,
    expressionAttributeValues: { [key: string]: any },
    expressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
  ) => {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: table,
      Key: { pk, sk },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'UPDATED_NEW',
    };
    return dynamoDB.update(params).promise();
  };

  /**
   * Delete an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   */
  deleteItem = async (table: string, pk: string, sk: string) => {
    const params: DeleteItemInput = {
      TableName: table,
      Key: { pk, sk },
    };
    await dynamoDB.delete(params).promise();
  };

  rawUpdateItem = async (input: UpdateItemInput) => dynamoDB.update(input).promise();
}
