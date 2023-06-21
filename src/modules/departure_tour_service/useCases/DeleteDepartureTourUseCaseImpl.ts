import { departureTourRepository } from '../repositories';
import { DeleteDepartureTourUseCase } from './interfaces/DeleteDepartureTourUseCase';

export default class DeleteDepartureTourUseCaseImpl implements DeleteDepartureTourUseCase {
  invoke = async (
    tenantId: string,
    departureTourId: string,
  ) => departureTourRepository.delete(tenantId, departureTourId);
}
