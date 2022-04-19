import * as AWS from 'aws';
import { getEnv } from 'get-env';
import { Lead } from '../models/Lead';

type PutItemInput = AWS.DynamoDB.PutItemInput;
type GetItemInput = AWS.DynamoDB.GetItemInput;

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

  getListItemByField = async (
    table: string,
    tenantId: string,
    field: string,
    value: string,
  ) : Promise<Lead[]> => {
    const params = {
      FilterExpression: '#field = :value and begins_with(pk, :tenantId)',
      ExpressionAttributeNames: { '#field': field },
      ExpressionAttributeValues: {
        ':value': { S: value },
        ':tenantId': { S: `Tenant#${tenantId}#Lead#` },
      },
      TableName: table,
    };

    const scanResult = await dynamoDB.scan(params).promise();

    return scanResult.Items?.map(
      (element: any) => AWS.DynamoDB.Converter.unmarshall(element) as Lead,
    ) || [];
  };
}
