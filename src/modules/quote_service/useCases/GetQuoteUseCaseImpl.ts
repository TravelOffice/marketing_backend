import { quoteRepository } from '../repositories';
import { GetQuoteUseCase } from './interfaces/GetQuoteUseCase';

export default class GetQuoteUseCaseImpl implements GetQuoteUseCase {
  invoke = (id: string | number) => quoteRepository.get(id);
}
