import { tourOperationRepository } from '../repositories';
import { TourPlanReturnedData } from '../api/TourPlanReturnedData';
import { UpdateTourTrackingUseCase } from './interfaces/UpdateTourTrackingUseCase';
import { TourTracking } from '../models/tour/TourTracking';

export default class UpdateTourTrackingUseCaseImpl implements UpdateTourTrackingUseCase {
  async invoke(
    tenantId: string,
    departureTourId: string,
    tourTracking: TourTracking,
  ): Promise<TourPlanReturnedData> {
    return tourOperationRepository.updateTourTracking(tenantId, departureTourId, tourTracking);
  }
}
