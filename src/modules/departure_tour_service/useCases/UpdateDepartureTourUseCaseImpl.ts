import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { UpdateDepartureTourUseCase } from './interfaces/UpdateDepartureTourUseCase';

export default class UpdateDepartureTourUseCaseImpl implements UpdateDepartureTourUseCase {
  invoke = (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour,
  ) => {
    const departureTourToUpdate: DepartureTour = {
      ...departureTour,
      updatedAt: Date.now(),
    };
    return departureTourRepository.update(tenantId, departureTourId, departureTourToUpdate);
  };
}
