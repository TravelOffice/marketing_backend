import { Quote } from '../../models/Quote';

export interface GetQuotesByOpportunityUseCase {
  invoke: (
    userId: string,
    leadId: string,
    opportunityId: string,
    status?: string,
  ) => Promise<Array<Quote>>;
}
