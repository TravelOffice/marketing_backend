import { tourPostRepository } from '../repositories';
import { GetTourPostListUseCase } from './interfaces/GetTourPostListUseCase';

export default class GetTourPostListUseCaseImpl implements GetTourPostListUseCase {
  invoke = async (nextToken?: string, limit?: number) => tourPostRepository.list(nextToken, limit);
}
