import { Quote } from '../../models/Quote';

export interface UpdateQuoteUseCase {
  invoke: (id: string | number, quote: Quote) => Promise<Quote>;
}
