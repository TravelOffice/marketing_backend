import { getAwsSecretValue } from 'get-env';
import { Lead } from '../models/Lead';
import { dynamoProvider } from '../providers';
import { LeadRepository } from './interfaces/LeadRepository';

export default class LeadRepositoryImpl implements LeadRepository {
  /**
   * Create or update lead information in dynamo db
   * @param tenantId Tenant ID
   * @param lead Lead object
   * @returns pk, sk and all atributes of Lead object
   */
  createOrUpdate = async (tenantId: string, lead: Lead) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `Tenant#${tenantId}#Lead#${lead.primaryPhoneNumber}`;
    const sk = `Lead#${lead.primaryPhoneNumber}`;
    await dynamoProvider.putItem(table, pk, sk, lead);
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
    const pk = `Tenant#${tenantId}#Lead#${leadId}`;
    const sk = `Lead#${leadId}`;
    return dynamoProvider.getItem<Lead>(table, pk, sk);
  };

  /**
   * Get information of a lead list by condition with a value of a field
   * @param field DynamoDB field name to query
   * @param value The value of DynamoDB field name
   * @returns A List of Lead object
   */
  getLeadListByField = async (tenantId: string, field: string, value: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getListItemByField(table, tenantId, field, value);
  };
}
