import { getAwsSecretValue } from 'get-env';
import AWS from 'aws';
import { Quote } from '../models/Quote';
import { QuoteRepository } from './interfaces/QuoteRepository';
import { QUOTE_INDEX, TENANT_INDEX } from '../utils/constants';
import { QueryInput } from '../providers/DynamoProvider';
import { dynamoProvider } from '../providers';

export default class QuoteRepositoryImpl implements QuoteRepository {
  list = async () => {
    throw new Error('Method not implemented!');
  };

  get = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };

  create = async (quote: Quote) => {
    console.log(quote);
    throw new Error('Method not implemented!');
  };

  update = async (id: string | number, quote: Quote) => {
    console.log(id, quote);
    throw new Error('Method not implemented!');
  };

  delete = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };

  getListByOpportunity = async (
    tenantId: string,
    leadId: string,
    opportunityId: string,
    status?: string,
  ) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLsi = 'QUOTE_STATUS#';
    if (status) {
      filterLsi = `${filterLsi}#${status}`;
    }
    console.log(leadId, opportunityId);
    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'TypeIndex',
      KeyConditionExpression: 'pk = :pk AND begins_with(typeLsi, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${QUOTE_INDEX}` },
        ':lsi_filter_value': { S: filterLsi },
      },
    };
    const { Items } = await dynamoProvider.rawQuery(params);
    if (Items) {
      return Items.map((item: any) => {
        const opportunity = AWS.DynamoDB.Converter.unmarshall(item);
        const { sk, pk, ...rest } = opportunity;
        return rest as Quote;
      });
    }
    return [];
  };
}
