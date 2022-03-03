import * as AWS from 'aws';
import { getEnv } from 'get-env';

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({ region: getEnv('AWS_REGION') });

type GetItemParams = AWS.DynamoDB.DocumentClient.GetItemInput;
export default class DynamoProvider {

  getItem = async (params: GetItemParams): Promise<any> => docClient.get(params).promise();

}
