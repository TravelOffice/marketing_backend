import { tourOperationRepository } from '../repositories';
import { TourPlanReturnedData } from '../api/TourPlanReturnedData';
import { UpdateTourPlanUseCase } from './interfaces/UpdateTourPlanUseCase';
import { TourPlan } from '../models/tour/TourPlan';

export default class UpdateTourPlanUseCaseImpl implements UpdateTourPlanUseCase {
  async invoke(
    tenantId: string,
    departureTourId: string,
    tourPlan: TourPlan,
  ): Promise<TourPlanReturnedData> {
    return tourOperationRepository.updatePlan(tenantId, departureTourId, tourPlan);
  }
}
