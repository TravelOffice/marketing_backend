import { Lead, LeadType, LeadStatus } from '../../models/Lead';

export interface LeadRepository {
  getLeadListByAssigneeAndStatus: (
    tenantId: string, userId: string, type: LeadType, status?: LeadStatus
  ) => Promise<Array<Lead>>,
}
