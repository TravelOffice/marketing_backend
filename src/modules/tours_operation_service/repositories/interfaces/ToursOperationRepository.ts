import { TourPlanReturnedData } from '../../api/TourPlanReturnedData';
import { DepartureTour } from '../../models/tour/DepartureTour';
import { TourPlan } from '../../models/tour/TourPlan';
import { TourTracking } from '../../models/tour/TourTracking';
import { TourTrackingReturnedData } from '../../api/TourTrackingReturnedData';

export interface ToursOperationRepository {
  getPlan(tenantId: string, departureTourId: string): Promise<TourPlanReturnedData>,
  get: (tenant: string, id: string) => Promise<DepartureTour | undefined>,
  updatePlan(
    tenantId: string,
    departureTourId: string,
    tourPlan: TourPlan,
  ): Promise<TourPlanReturnedData>,
  getTourTracking(tenantId: string, departureTourId: string): Promise<TourTrackingReturnedData>,
  updateTourTracking(
      tenantId: string,
      departureTourId: string,
      tourTracking: TourTracking,
  ): Promise<TourTrackingReturnedData>,
}
