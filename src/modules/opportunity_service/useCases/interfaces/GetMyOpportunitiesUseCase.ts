import { Opportunity, OpportunityStatus } from '../../models/Opportunity';

export interface GetMyOpportunitiesUseCase {
  invoke: (userId: string, status?: OpportunityStatus) => Promise<Array<Opportunity>>;
}
