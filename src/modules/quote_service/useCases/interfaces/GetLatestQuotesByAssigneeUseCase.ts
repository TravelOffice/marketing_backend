import { Quote, QuoteStatus } from '../../models/Quote';

export interface GetQuoteListByAssigneeUseCase {
  invoke: (userId: string, status: QuoteStatus) => Promise<Omit<Quote, 'pk' | 'sk' | 'lsi1' | 'lsi2' | 'lsi3' | 'lsi4' | 'lsi5'>[]>;
}
