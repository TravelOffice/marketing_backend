import { tourOperationRepository } from '../repositories';
import { GetTourPlanUseCase } from './interfaces/GetTourPlanUseCase';
import { TourPlanReturnedData } from '../api/TourPlanReturnedData';

export default class GetTourPlanUseCaseImpl implements GetTourPlanUseCase {
  async invoke(
    tenantId: string,
    departureTourId: string,
  ): Promise<TourPlanReturnedData> {
    return tourOperationRepository.getPlan(tenantId, departureTourId);
  }
}
