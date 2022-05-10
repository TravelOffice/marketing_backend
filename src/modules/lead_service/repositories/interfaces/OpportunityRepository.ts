import { Opportunity } from '../../models/Opportunity';

export interface OpportunityRepository {
  getAllByLeadId: (tenantId: string, leadId: string) => Promise<Array<Opportunity>>
  update: (opportunity: Opportunity, tenantId: string) => Promise<Opportunity>
}
