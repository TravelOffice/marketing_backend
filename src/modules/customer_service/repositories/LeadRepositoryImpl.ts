/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAwsSecretValue } from 'get-env';
import { helper, dynamoProvider, QueryInput } from 'core';
import { Lead } from '../models/Lead';

import {
  CUSTOMER_INDEX,
  LEAD_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { LeadRepository } from './interfaces/LeadRepository';

export default class LeadRepositoryImpl implements LeadRepository {
  /**
   * Retrieves leads associated with a specific customer.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} customerId - The ID of the customer.
   * @returns {Promise<Lead[]>} - A promise that resolves to an array of customer's lead.
   */
  getByCustomer = async (tenantId: string, customerId: string) => {
    // Build the query parameters to retrieve leads by customer
    const queryParameters = {
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'), // Name of the DynamoDB table
      IndexName: 'Index5', // Name of the index to query
      KeyConditionExpression: 'pk = :pk AND lsi5 = :lsi5', // Key condition expression for the query
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`, // Value for the partition key
        ':lsi5': `${CUSTOMER_INDEX}#${customerId}`, // Value for the sort key prefix
      },
    };

    // Perform the query to retrieve the leads
    return this.queryLeads(queryParameters);
  };

  private async queryLeads(input: QueryInput) {
    const items = await dynamoProvider.query(input);
    const leads = items.map((item) => helper.excludeDataFromObject(item));
    return leads as Lead[];
  }
}
