import { Quote } from '../models/Quote';
import { quoteRepository } from '../repositories';
import { CreateQuoteUseCase } from './interfaces/CreateQuoteUseCase';

export default class CreateQuoteUseCaseImpl implements CreateQuoteUseCase {
  invoke = async (quote: Quote) => quoteRepository.create(quote);
}
