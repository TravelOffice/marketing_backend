import { quoteRepository } from '../repositories';
import { GetQuoteListUseCase } from './interfaces/GetQuoteListUseCase';

export default class GetQuoteListUseCaseImpl implements GetQuoteListUseCase {
  invoke = async () => quoteRepository.list();
}
