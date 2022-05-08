import * as AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Lead, LeadType, LeadStatus } from '../models/Lead';
import { dynamoProvider } from '../providers';
import { DISABLED, ENABLED } from '../utils/constants';
import { LeadRepository } from './interfaces/LeadRepository';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class LeadRepositoryImpl implements LeadRepository {
  /**
   * Create or update lead information in dynamo db
   * @param tenantId Tenant ID
   * @param lead Lead object
   * @returns pk, sk and all atributes of Lead object
   */
  createOrUpdate = async (tenantId: string, lead: Lead) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `Tenant#${tenantId}`;
    const sk = `Lead#${lead.primaryPhoneNumber}`;
    const typeLsi = `${lead.type}#${lead.assigneeId}#${lead.enabled ? ENABLED : DISABLED}#${lead.status}`;
    await dynamoProvider.putItem(table, pk, sk, { ...lead, typeLsi });
    return lead;
  };

  /**
   * Get lead by id
   * @param tenantId Tenant ID
   * @param leadId Lead ID
   * @returns Lead object
   */
  getById = async (tenantId: String, leadId: String) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `Tenant#${tenantId}`;
    const sk = `Lead#${leadId}`;
    return dynamoProvider.getItem<Lead>(table, pk, sk);
  };

  /**
   * Get information of a lead list by condition with a value of a field
   * @param tenantId Tenant code
   * @param field DynamoDB field name to query
   * @param value The value of DynamoDB field name
   * @returns A List of Lead object
   */
  getLeadListByField = async (tenantId: string, field: string, value: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeNames: {
        '#field': field,
      },
      FilterExpression: ' #field = :value',
      ExpressionAttributeValues: {
        ':pk': { S: `Tenant#${tenantId}` },
        ':sk_filter_value': { S: 'Lead#' },
        ':value': { S: value },
      },
    };
    return dynamoProvider.query(params);
  };

  /**
   * Get information of a lead list by tenantId
   * @param tenantId Tenant code
   * @returns A List of Lead object
   */
  getLeadListByTenant = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: table,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `Tenant#${tenantId}` },
        ':sk_filter_value': { S: 'Lead#' },
      },
    };
    return dynamoProvider.query(params);
  };

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
        ':pk': { S: `Tenant#${tenantId}` },
        ':lsi_filter_value': { S: filterLSI },
      },
    };
    return dynamoProvider.query(params);
  };
}
