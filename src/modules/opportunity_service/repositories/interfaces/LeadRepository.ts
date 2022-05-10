export interface LeadRepository {
  /**
   * Method to check if a Lead exists by given the id
   * @param tenantId The id of the Tenant which the Lead should belong to
   * @param leadId The id of the Lead which should be checked
   */
   isLeadExisted: (tenantId: string, leadId: string) => Promise<boolean>
}
