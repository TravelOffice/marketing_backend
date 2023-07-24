import { DepartureTour } from '../models/tour/DepartureTour';

export type UpdateTourPlanDto = Pick<DepartureTour, 'tourPlan'>;
