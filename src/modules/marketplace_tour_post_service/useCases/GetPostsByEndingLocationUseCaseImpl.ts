import { tourPostRepository } from '../repositories';
import { GetPostsByEndingLocationUseCase } from './interfaces/GetPostsByEndingLocationUseCase';
import { GetPostsByEndingLocationParams } from '../repositories/interfaces/TourPostRepository';

export default class GetPostsByEndingLocationUseCaseImpl
implements GetPostsByEndingLocationUseCase {
  invoke = async (
    params: GetPostsByEndingLocationParams,
  ) => tourPostRepository.listByEndingLocation(params);
}
