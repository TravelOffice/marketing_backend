import { Opportunity } from '../../models/Opportunity';

export interface DeleteOpportunityUseCase {
  invoke: (
    id: string,
    userId: string,
    leadId: string,
  ) => Promise<void>;
}
