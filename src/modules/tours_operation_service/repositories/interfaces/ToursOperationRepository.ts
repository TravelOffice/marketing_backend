import { TourPlanReturnedData } from '../../api/TourPlanReturnedData';
import { TourPlan } from '../../models/tour/TourPlan';

export interface ToursOperationRepository {
  getPlan(tenantId: string, departureTourId: string): Promise<TourPlanReturnedData>,
  updatePlan(
    tenantId: string,
    departureTourId: string,
    tourPlan: TourPlan,
  ): Promise<TourPlanReturnedData>,
}
