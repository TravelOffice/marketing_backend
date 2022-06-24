import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Lead, LeadType, LeadStatus } from '../models/Lead';
import { dynamoProvider } from '../providers';
import {
  ENABLED,
  TENANT_INDEX,
} from '../utils/constants';
import { LeadRepository } from './interfaces/LeadRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class LeadRepositoryImpl implements LeadRepository {
  /**
   * Get information of a enabled lead list by tenantId, assignee, and status
   * Disabled leads will be only viewed by admin
   * @param tenantId Tenant code
   * @param userId Assignee of lead
   * @param type type of Lead (Lead|Customer)
   * @param status status of Lead
   * @returns A List of Lead object
   */
  getLeadListByAssigneeAndStatus = async (
    tenantId: string,
    userId: string,
    type: LeadType,
    status?: LeadStatus,
  ): Promise<Lead[]> => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLSI = `${type}#${userId}#${ENABLED}`;
    if (status) {
      filterLSI = `${type}#${userId}#${ENABLED}#${status}`;
    }
    const params: QueryInput = {
      TableName: table,
      IndexName: 'TypeIndex',
      KeyConditionExpression: 'pk = :pk AND begins_with(typeLsi, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}` },
        ':lsi_filter_value': { S: filterLSI },
      },
    };
    return dynamoProvider.query(params);
  };
}
