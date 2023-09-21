import { tourPostRepository } from '../repositories';
import { GetPostsByDepartureDateUseCase } from './interfaces/GetPostsByDepartureDateUseCase';
import { GetPostsByDepartureDateParams } from '../repositories/interfaces/TourPostRepository';

export default class GetPostsByDepartureDateUseCaseImpl implements GetPostsByDepartureDateUseCase {
  invoke = async (
    params: GetPostsByDepartureDateParams,
  ) => tourPostRepository.listByDepartureDate(params);
}
