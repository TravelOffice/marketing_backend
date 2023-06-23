import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { DEPARTURE_TOUR_INDEX } from '../utils/constants';
import { CreateDepartureTourUseCase } from './interfaces/CreateDepartureTourUseCase';

export default class CreateDepartureTourUseCaseImpl implements CreateDepartureTourUseCase {
  invoke = async (
    tenantId: string,
    departureTour: DepartureTour,
  ) => {
    const now = Date.now();
    const code = await departureTourRepository.generateDepartureTourCode(tenantId);
    const departureTourToAdd: DepartureTour = {
      ...departureTour,
      code,
      createdAt: now,
      updatedAt: now,
      lsi1: `${DEPARTURE_TOUR_INDEX}#${now}`,
    };
    return departureTourRepository.create(tenantId, departureTourToAdd);
  };
}
