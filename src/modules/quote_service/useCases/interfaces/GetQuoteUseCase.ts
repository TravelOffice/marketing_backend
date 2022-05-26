import { Quote } from '../../models/Quote';

export interface GetQuoteUseCase {
  invoke: (id: string | number) => Promise<Quote>;
}
