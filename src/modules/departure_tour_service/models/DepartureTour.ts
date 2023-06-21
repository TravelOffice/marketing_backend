import { TourTemplate } from './TourTemplate';

export interface DepartureTour extends Omit<TourTemplate, 'lsi1'> {
  tourTemplate: string, // Tour template ID (sk)
  startDate: number,
}

export interface DepartureTourWithId extends DepartureTour {
  id: string,
}
