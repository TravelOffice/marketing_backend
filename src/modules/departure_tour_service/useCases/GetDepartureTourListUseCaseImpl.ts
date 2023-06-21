import { departureTourRepository } from '../repositories';
import { GetDepartureTourListUseCase } from './interfaces/GetDepartureTourListUseCase';

export default class GetDepartureTourListUseCaseImpl implements GetDepartureTourListUseCase {
  invoke = async (tenantId: string) => departureTourRepository.list(tenantId);
}
