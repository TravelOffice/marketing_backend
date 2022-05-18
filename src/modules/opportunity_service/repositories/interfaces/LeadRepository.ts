import { Lead } from '../../models/Lead';

export interface LeadRepository {
  /**
   * Method to check if a Lead exists by given the id
   * @param tenantId The id of the Tenant which the Lead should belong to
   * @param leadId The id of the Lead which should be checked
   */
   isLeadExisted: (tenantId: string, leadId: string) => Promise<boolean>

  /**
   * Method to get a Lead by given id
   * @param tenantId The id of the Tenant which the Lead should belong to
   * @param leadId The id of the Lead which should be checked
   * @returns the Lead if existing or `undefined` otherwise.
   */
  get: (tenantId: string, leadId: string) => Promise<Lead | undefined>
}
