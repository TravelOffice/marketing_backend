import { Lead, LeadType, LeadStatus } from '../../models/Lead';

export interface LeadRepository {
  createOrUpdate: (tenantId: string, lead: Lead) => Promise<Lead>,
  getById: (tenantId: String, leadId: String) => Promise<Lead | undefined>,
  getLeadListByField: (tenantId: string, field: string, value: string) => Promise<Array<Lead>>,
  getLeadListByTenant: (tenantId: string) => Promise<Array<Lead>>,
  getLeadListByAssigneeAndStatus: (
    tenantId: string, userId: string, type: LeadType, status?: LeadStatus
  ) => Promise<Array<Lead>>,
}
