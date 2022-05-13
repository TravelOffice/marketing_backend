import { Opportunity } from '../../models/Opportunity';

export interface GetOpportunitiesByLeadUseCase {
  invoke: (userId: string, leadId: string) => Promise<Array<Opportunity>>;
}
