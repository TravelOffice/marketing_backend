import { tourOperationRepository } from '../repositories';
import { GetTourTrackingUseCase } from './interfaces/GetTourTrackingUseCase';
import { TourTrackingReturnedData } from '../api/TourTrackingReturnedData';

export default class GetTourTrackingUseCaseImpl implements GetTourTrackingUseCase {
  async invoke(
    tenantId: string,
    departureTourId: string,
  ): Promise<TourTrackingReturnedData> {
    return tourOperationRepository.getTourTracking(tenantId, departureTourId);
  }
}
