import * as AWS from 'aws';

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-southeast-1'});

type GetItemParams = AWS.DynamoDB.DocumentClient.GetItemInput;
export default class DynamoProvider {

  getItem = async (params: GetItemParams): Promise<any> => docClient.get(params).promise();

}
