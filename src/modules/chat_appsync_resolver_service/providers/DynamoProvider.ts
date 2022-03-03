import * as AWS from 'aws';
import { getEnv } from 'get-env';

// Create the DynamoDB service object
const dynamoDB: AWS.DynamoDB = new AWS.DynamoDB({ region: getEnv('AWS_REGION') });

type GetItemInput = AWS.DynamoDB.DocumentClient.GetItemInput;

export default class DynamoProvider {

  getItem = async (params: GetItemInput): Promise<any> => dynamoDB.getItem(params).promise();

}
