import { TourPlanReturnedData } from '../../api/TourPlanReturnedData';
import { TourTracking } from '../../models/tour/TourTracking';

export interface UpdateTourTrackingUseCase {
  invoke(
      tenantId: string,
      departureTourId: string,
      tourTracking: TourTracking,
  ): Promise<TourPlanReturnedData>,
}
