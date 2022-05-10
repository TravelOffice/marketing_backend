import { Opportunity } from '../../models/Opportunity';

export interface CreateOpportunityUseCase {
  invoke: (userId: string, leadId: string, opportunity: Opportunity) => Promise<Opportunity>
}
