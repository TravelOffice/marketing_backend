import * as AWS from 'aws';
import { getEnv } from 'get-env';

type PutItemInput = AWS.DynamoDB.PutItemInput;
type GetItemInput = AWS.DynamoDB.GetItemInput;
type DeleteItemInput = AWS.DynamoDB.DeleteItemInput;
type QueryInput = AWS.DynamoDB.QueryInput;

const dynamoDB : AWS.DynamoDB = new AWS.DynamoDB({ region: getEnv('AWS_REGION') });

export default class DynamoProvider {
  putItem = async (table: string, pk: string, sk: string, data: any) => {
    const params : PutItemInput = {
      TableName: table,
      Item: AWS.DynamoDB.Converter.marshall({ pk, sk, ...data }),
    };
    return dynamoDB.putItem(params).promise();
  };

  getItem = async <T = any>(table: string, pk: string, sk: string) : Promise< T | undefined> => {
    const params : GetItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
    };
    const { Item } = await dynamoDB.getItem(params).promise();
    if (!Item) {
      return undefined;
    }
    return AWS.DynamoDB.Converter.unmarshall(Item) as T;
  };

  deleteItem = async (table: string, pk: string, sk:string) => {
    const params : DeleteItemInput = {
      TableName: table,
      Key: AWS.DynamoDB.Converter.marshall({ pk, sk }),
    };
    await dynamoDB.deleteItem(params).promise();
  };

  query = async (queryInput: QueryInput) => {
    const rs = await dynamoDB.query(queryInput).promise();
    return rs;
  };
}
