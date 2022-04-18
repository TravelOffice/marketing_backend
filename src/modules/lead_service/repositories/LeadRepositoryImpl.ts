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
    const pk = `Tenant#${tenantId}#Lead#${lead.createdAt}`;
    const sk = `Lead#${lead.createdAt}`;
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
  }
}
