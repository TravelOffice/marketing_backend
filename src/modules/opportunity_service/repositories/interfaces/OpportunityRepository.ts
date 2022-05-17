import { Opportunity } from '../../models/Opportunity';

export interface OpportunityRepository {
  get: (id: string, tenantId: string, leadId: string) => Promise<Opportunity | undefined>
  update: (opportunity: Opportunity, tenantId: string) => Promise<Opportunity>
  unassign: (id: string, tenantId: string, assigneeId: string) => Promise<void>
  delete: (opportunity: Opportunity, tenantId: string) => Promise<void>
  getListByLead: (tenantId: string, leadId: string) => Promise<Array<Opportunity>>
  getListByAssignee: (tenantId: string, assigneeId: string) => Promise<Array<Opportunity>>
}
