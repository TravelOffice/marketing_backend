import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { CreateDepartureTourUseCase } from './interfaces/CreateDepartureTourUseCase';

export default class CreateDepartureTourUseCaseImpl implements CreateDepartureTourUseCase {
  invoke = async (
    tenantId: string,
    departureTour: DepartureTour,
  ) => departureTourRepository.create(tenantId, departureTour);
}
