import { DepartureTour } from '../models/tour/DepartureTour';

export type TourPlanReturnedData = Pick<DepartureTour, 'tourPlan' | 'code'>;
