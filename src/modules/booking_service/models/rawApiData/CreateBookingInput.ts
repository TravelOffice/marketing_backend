import { BookingTourType } from '../booking/Booking';
import { HonorificType } from '../Customer';
import { Service } from '../booking/Service';

export interface CreateBookingInput {
  // Customer information, new customer will be created in database if not existed
  customer: {
    email: string
    primaryPhoneNumber: string
    honorific: HonorificType
    name: string
    address: string
  },
  // Reference to TourTemplate model, each TourTemplate is identified by pk+sk pair
  tourTemplateId: string,
  // One kind of ['shared', 'group', 'solo']
  tourType: BookingTourType,
  // Expected begin date of trip
  departureDate: string,
  // Reference to Sale model, each Sale is identified by pk+sk pair
  assigneeId: string,
  // Reference to source model
  sourceId: string,

  services: Service[]
}
