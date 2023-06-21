import AWS from 'aws';
import { getEnv } from 'get-env';

type PutItemInput = AWS.DynamoDB.PutItemInput;
type GetItemInput = AWS.DynamoDB.GetItemInput;
type QueryInput = AWS.DynamoDB.QueryInput;
type DeleteItemInput = AWS.DynamoDB.DeleteItemInput;

const dynamoDB: AWS.DynamoDB = new AWS.DynamoDB({ region: getEnv('AWS_REGION') });

export default class DynamoProvider {
  putItem = async (table: string, pk: string, sk: string, data: any) => {
    const params: PutItemInput = {
      TableName: table,
      Item: AWS.DynamoDB.Converter.marshall({ pk, sk, ...data }),
    };
    return dynamoDB.putItem(params).promise();
  };

  getItem = async <T = any>(table: string, pk: string, sk: string): Promise<T | undefined> => {
    const params: GetItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
    };
    const { Item } = await dynamoDB.getItem(params).promise();
    if (!Item) {
      return undefined;
    }
    return AWS.DynamoDB.Converter.unmarshall(Item) as T;
  };

  query = async <T = any>(params: QueryInput): Promise<T[]> => {
    const { Items } = await dynamoDB.query(params).promise();
    if (Items) {
      return Items.map((item: any) => AWS.DynamoDB.Converter.unmarshall(item) as T);
    }
    return [];
  };

  updateItem = async (
    table: string,
    pk: string,
    sk: string,
    updateExpression: string,
    expressionAttributeValues: { [key: string]: any },
    expressionAttributeNames?: AWS.DynamoDB.ExpressionAttributeNameMap,
  ) => {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: AWS.DynamoDB.Converter.marshall(expressionAttributeValues),
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'UPDATED_NEW',
    };
    const rs = await dynamoDB.updateItem(params).promise();
    return rs;
  };

  deleteItem = async (table: string, pk: string, sk: string) => {
    const params: DeleteItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
    };
    await dynamoDB.deleteItem(params).promise();
  };
}
