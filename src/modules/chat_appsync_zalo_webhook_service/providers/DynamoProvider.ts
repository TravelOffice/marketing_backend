import AWS from 'aws';
import { getEnv } from 'get-env';

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient({ region: getEnv('AWS_REGION') });

type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

export default class DynamoProvider {
  query = async (params: QueryInput): Promise<QueryOutput> => docClient.query(params).promise();
}
