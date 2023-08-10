import { DepartureTour } from '../models/DepartureTour';

export type UpdateDepartureTourDto = Pick<DepartureTour,
    'name' |
    'startDate' |
    'type' |
    'visitorCount' |
    'startingLocation' |
    'endingLocation' |
    'durationInDays' |
    'durationInNights' |
    'services' |
    'policiesAndRegulations' |
    'tourPlan' |
    'status'
>;
