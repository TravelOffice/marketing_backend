import { DepartureTour } from '../models/tour/DepartureTour';

export type TourTrackingReturnedData = Pick<DepartureTour, 'tourTracking' | 'code'>;
