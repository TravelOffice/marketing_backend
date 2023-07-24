import { TourPlanReturnedData } from '../../api/TourPlanReturnedData';

export interface GetTourPlanUseCase {
  invoke(tenantId: string, departureTourId: string): Promise<TourPlanReturnedData>,
}
