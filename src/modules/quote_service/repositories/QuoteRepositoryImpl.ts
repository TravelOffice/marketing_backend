import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Quote, QuoteStatus } from '../models/Quote';
import { dynamoProvider } from '../providers';
import { QueryInput } from '../providers/DynamoProvider';
import {
  LATEST_QUOTE_INDEX,
  LEAD_INDEX,
  OPPORTUNITY_INDEX,
  QUOTE_INDEX,
  TENANT_INDEX,
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

  /**
   * Get all the quotes of given opportunity
   * Also, quotes will be filtered by status if needed
   * @param tenantId Tenant code
   * @param leadId Lead id
   * @param opportunityId Opportunity id
   * @param status Status of quote to filter
   * @returns
   */
  getListByOpportunity = async (
    tenantId: string,
    leadId: string,
    opportunityId: string,
    status?: string,
  ) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const filterSk = `${LEAD_INDEX}#${leadId}#${OPPORTUNITY_INDEX}#${opportunityId}`;
    const params: QueryInput = {
      TableName: dynamoTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${QUOTE_INDEX}` },
        ':sk': { S: filterSk },
      },
    };
    const { Items } = await dynamoProvider.rawQuery(params);
    if (Items) {
      const quotes = Items.map((item: any) => {
        const quote = AWS.DynamoDB.Converter.unmarshall(item);
        const {
          sk, pk, typeLsi, ...rest
        } = quote;
        return rest as Quote;
      });
      if (status) {
        return quotes.filter((quote) => quote.status === status);
      }
      return quotes;
    }
    return [];
  };
}
