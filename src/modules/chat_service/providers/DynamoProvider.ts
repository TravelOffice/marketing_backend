import AWS from 'aws';
import { getEnv } from 'get-env';
import { UPDATE_SET_EXPRESSION } from '../utils/dynamodbConstants';
import logger from '../utils/logger';

type PutItemInput = AWS.DynamoDB.PutItemInput;
type GetItemInput = AWS.DynamoDB.GetItemInput;
type DeleteItemInput = AWS.DynamoDB.DeleteItemInput;
export type AttributeValues = AWS.DynamoDB.AttributeMap;
export type QueryInput = AWS.DynamoDB.QueryInput;

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

  query = async (
    table: string,
    keyCondition: string,
    expressionAttributeValues: AWS.DynamoDB.ExpressionAttributeValueMap,
  ) => {
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    const rs = await dynamoDB.query(params).promise();
    return rs;
  };

  rawQuery = async (input: QueryInput) => dynamoDB.query(input).promise();

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
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW',
    };
    const rs = await dynamoDB.updateItem(params).promise();
    return rs;
  };

  updateItemWithSetExpression = async (
    table: string,
    pk: string,
    sk: string,
    values: { [key: string]: any },
  ) => {
    // Build expression dynamically
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};
    let updateExpression = UPDATE_SET_EXPRESSION;
    Object.entries(values).forEach(([key, item]) => {
      updateExpression += ` ${key} = :${key},`;
      expressionAttributeNames[key] = key;
      expressionAttributeValues[`:${key}`] = item;
    });
    updateExpression = updateExpression.slice(0, -1);

    // Update item
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: AWS.DynamoDB.Converter.marshall(expressionAttributeValues),
      ReturnValues: 'UPDATED_NEW',
    };

    logger.log(`Updating new DynamoDB item with parameters ${JSON.stringify(params, null, 3)}`);

    return dynamoDB.updateItem(params).promise();
  };

  deleteItem = async (table: string, pk: string, sk: string) => {
    const params: DeleteItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
    };
    await dynamoDB.deleteItem(params).promise();
  };

  unmarshallValues = (obj: AttributeValues) => AWS.DynamoDB.Converter.unmarshall(obj);
}
