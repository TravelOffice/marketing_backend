import { departureTourRepository } from '../repositories';
import { GetDepartureTourUseCase } from './interfaces/GetDepartureTourUseCase';

export default class GetDepartureTourUseCaseImpl implements GetDepartureTourUseCase {
  invoke = (
    tenantId: string,
    departureTourId: string,
  ) => departureTourRepository.get(tenantId, departureTourId);
}
