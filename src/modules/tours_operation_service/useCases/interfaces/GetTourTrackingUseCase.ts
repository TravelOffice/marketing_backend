import { TourTrackingReturnedData } from '../../api/TourTrackingReturnedData';

export interface GetTourTrackingUseCase {
  invoke(tenantId: string, departureTourId: string): Promise<TourTrackingReturnedData>,
}
