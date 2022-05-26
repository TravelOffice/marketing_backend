import { Quote } from '../../models/Quote';

export interface GetQuoteListUseCase {
  invoke: () => Promise<Array<Quote>>;
}
