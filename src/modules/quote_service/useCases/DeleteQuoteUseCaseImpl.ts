import { quoteRepository } from '../repositories';
import { DeleteQuoteUseCase } from './interfaces/DeleteQuoteUseCase';

export default class DeleteQuoteUseCaseImpl implements DeleteQuoteUseCase {
  invoke = async (id: string | number) => quoteRepository.delete(id);
}
