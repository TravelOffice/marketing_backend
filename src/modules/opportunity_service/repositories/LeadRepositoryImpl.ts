import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import { LeadRepository } from './interfaces/LeadRepository';

export default class LeadRepositoryImpl implements LeadRepository {
  /**
   * Method to check if a Lead exists by given the id
   * @param tenantId The id of the Tenant which the Lead should belong to
   * @param leadId The id of the Lead which should be checked
   * @returns Promise<boolean> to determine the Lead exists or not
   */
  isLeadExisted = async (tenantId: string, leadId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const lead = await dynamoProvider.getItem(dynamoTable, `Tenant#${tenantId}`, `Lead#${leadId}`);
    return !!lead;
  };
}
