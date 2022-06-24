import { getAwsSecretValue } from 'get-env';
import { Quote, QuoteStatus } from '../models/Quote';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  LATEST_QUOTE_INDEX, LEAD_INDEX, QUOTE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { QuoteRepository } from './interfaces/QuoteRepository';

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

  /**
   * Get information of a latest quote list by tenantId, leadId, and status
   * @param tenantId Tenant code
   * @param leadId ID of lead
   * @param status status of Quote
   * @returns A List of Quote object
   */
  getLatestQuotesByLeadAndStatus = async (
    tenantId: string,
    leadId: string,
    status?: QuoteStatus,
  ): Promise<Array<Quote>> => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLSI = `${LEAD_INDEX}#${leadId}#${LATEST_QUOTE_INDEX}`;
    if (status) {
      filterLSI = `${LEAD_INDEX}#${leadId}#${LATEST_QUOTE_INDEX}#${status}`;
    }
    const params: QueryInput = {
      TableName: table,
      IndexName: 'TypeIndex',
      KeyConditionExpression: 'pk = :pk AND begins_with(typeLsi, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${QUOTE_INDEX}` },
        ':lsi_filter_value': { S: filterLSI },
      },
    };
    return dynamoProvider.query(params);
  };
}
