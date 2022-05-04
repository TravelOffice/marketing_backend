import { Opportunity } from '../../models/Opportunity';

export interface GetOpportunityUseCase {
  invoke: (id: string, userId: string, leadId: string) => Promise<Opportunity>;
}
