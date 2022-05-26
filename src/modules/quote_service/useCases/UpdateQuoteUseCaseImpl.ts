import { Quote } from '../models/Quote';
import { quoteRepository } from '../repositories';
import { UpdateQuoteUseCase } from './interfaces/UpdateQuoteUseCase';

export default class UpdateQuoteUseCaseImpl implements UpdateQuoteUseCase {
  invoke = (id: string | number, quote: Quote) => quoteRepository.update(id, quote);
}
