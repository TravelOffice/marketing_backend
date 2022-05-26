import { Quote } from '../../models/Quote';

export interface QuoteRepository {
  list: () => Promise<Array<Quote>>
  create: (quote: Quote) => Promise<Quote>
  get: (id: string | number) => Promise<Quote>
  update: (id: string | number, quote: Quote) => Promise<Quote>
  delete: (id: string | number) => Promise<void>
}
