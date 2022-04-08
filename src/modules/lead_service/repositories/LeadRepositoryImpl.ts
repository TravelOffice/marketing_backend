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
    const table = await getAwsSecretValue('SALE_CHAT_TABLE');
    const pk = `Tenant#${tenantId}#Lead#${lead.primaryPhoneNumber}`;
    const sk = `Lead#${lead.primaryPhoneNumber}`;
    await dynamoProvider.putItem(table, pk, sk, lead);
    return lead;
  };
}
