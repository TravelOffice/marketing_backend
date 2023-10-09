import { Customer } from '../Customer';
import { Lead } from '../Lead';
import { TourTemplate } from '../tour/TourTemplate';

export interface BookingsRelatedItems {
  leads: Lead[],
  tourTemplates: TourTemplate[],
  customers: Customer[],
}
