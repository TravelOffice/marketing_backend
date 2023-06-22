import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { UpdateDepartureTourUseCase } from './interfaces/UpdateDepartureTourUseCase';

export default class UpdateDepartureTourUseCaseImpl implements UpdateDepartureTourUseCase {
  invoke = (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour,
  ) => departureTourRepository.update(tenantId, departureTourId, departureTour);
}
