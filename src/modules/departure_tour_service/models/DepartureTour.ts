import { TourStatus } from './TourStatus';
import { TourTemplate } from './TourTemplate';

export interface DepartureTour extends TourTemplate {
  tourTemplate: string, // Tour template ID (sk)
  startDate: number,
  status: TourStatus,
}
