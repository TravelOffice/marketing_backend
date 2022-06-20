import { Quote, QuoteStatus } from '../../models/Quote';

export interface QuoteRepository {
  list: () => Promise<Array<Quote>>
  create: (quote: Quote) => Promise<Quote>
  get: (id: string | number) => Promise<Quote>
  update: (id: string | number, quote: Quote) => Promise<Quote>
  delete: (id: string | number) => Promise<void>
  getLatestQuotesByLeadAndStatus: (
    tenantId: string, leadId: string, status?: QuoteStatus,
  ) => Promise<Array<Quote>>
}
