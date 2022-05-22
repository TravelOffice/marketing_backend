import { Opportunity, OpportunityStatus } from '../../models/Opportunity';

export interface GetOpportunitiesByLeadUseCase {
  invoke: (
    userId: string, leadId: string, status?: OpportunityStatus,
  ) => Promise<Array<Opportunity>>;
}
