import AWS from 'aws';
import { getEnv } from 'get-env';

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({ region: getEnv('AWS_REGION') });

type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryOutput = AWS.DynamoDB.DocumentClient.QueryOutput;
type UpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutput = AWS.DynamoDB.DocumentClient.UpdateItemOutput;
type GetItemInput = AWS.DynamoDB.DocumentClient.GetItemInput;

export default class DynamoProvider {
  query = async (params: QueryInput): Promise<QueryOutput> => docClient.query(params).promise();

  update = async (
    params: UpdateItemInput,
  ): Promise<UpdateItemOutput> => docClient.update(params).promise();

  get = async <T = any>(table: string, pk: string, sk: string): Promise<T | undefined> => {
    const params: GetItemInput = {
      TableName: table,
      Key: { pk, sk },
    };
    const { Item } = await docClient.get(params).promise();
    if (!Item) {
      return undefined;
    }
    return Item as T;
  };
}
