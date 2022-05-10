import { Opportunity } from '../../models/Opportunity';

export interface UpdateOpportunityUseCase {
  invoke: (
    id: string,
    userId: string,
    leadId: string,
    opportunity: Omit<Opportunity, 'createdAt' | 'tenantId' | 'leadId'>
  ) => Promise<Opportunity>;
}
