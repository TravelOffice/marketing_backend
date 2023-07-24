import { TourPlanReturnedData } from '../../api/TourPlanReturnedData';
import { TourPlan } from '../../models/tour/TourPlan';

export interface UpdateTourPlanUseCase {
  invoke(
    tenantId: string,
    departureTourId: string,
    tourPlan: TourPlan,
  ): Promise<TourPlanReturnedData>,
}
