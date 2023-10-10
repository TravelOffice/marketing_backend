import { BookingTourType } from '../booking/Booking';
import { Service } from '../booking/Service';

export interface CreateBookingFromLeadInput {
  // Reference to Lead model
  leadId: string,
  // Reference to TourTemplate model, each TourTemplate is identified by pk+sk pair
  tourTemplateId: string,
  tourTemplateName: string,
  // One kind of ['shared', 'group', 'solo']
  tourType: BookingTourType,
  // Expected begin date of trip
  departureDate: string,
  // Reference to Sale model, each Sale is identified by pk+sk pair
  assigneeId: string,
  // List of services added to booking
  services: Service[],
}
