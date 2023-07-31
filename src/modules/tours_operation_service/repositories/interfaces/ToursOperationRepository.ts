import { TourPlanReturnedData } from '../../api/TourPlanReturnedData';
import { DepartureTour } from '../../models/tour/DepartureTour';
import { TourPlan } from '../../models/tour/TourPlan';

export interface ToursOperationRepository {
  getPlan(tenantId: string, departureTourId: string): Promise<TourPlanReturnedData>,
  get: (tenant: string, id: string) => Promise<DepartureTour | undefined>,
  updatePlan(
    tenantId: string,
    departureTourId: string,
    tourPlan: TourPlan,
  ): Promise<TourPlanReturnedData>,
}
