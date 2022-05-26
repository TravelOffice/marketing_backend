import { Quote } from '../../models/Quote';

export interface CreateQuoteUseCase {
  invoke: (quote: Quote) => Promise<Quote>;
}
