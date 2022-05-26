import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
import { LEAD_INDEX, TENANT_INDEX } from '../utils/constants';
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
    const lead = await dynamoProvider.getItem(dynamoTable, `${TENANT_INDEX}#${tenantId}`, `${LEAD_INDEX}#${leadId}`);
    return !!lead;
  };

  /**
   * Method to get a Lead by given id
   * @param tenantId The id of the Tenant which the Lead should belong to
   * @param leadId The id of the Lead which should be checked
   * @returns the Lead if existing or `undefined` otherwise.
   */
  get = async (tenantId: string, leadId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem(dynamoTable, `${TENANT_INDEX}#${tenantId}`, `${LEAD_INDEX}#${leadId}`);
  };
}
