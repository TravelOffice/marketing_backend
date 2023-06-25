import { BookingTourType } from '../booking/Booking';
import { HonorificType } from '../Customer';

export interface CreateBookingInput {
  // Customer information, new customer will be created in database if not existed
  customer: {
    email: string
    phone: string
    honorific: HonorificType
    fullName: string
    address: string
  },
  // Reference to TourTemplate model, each TourTemplate is indentified by pk+sk pair
  tourTemplateId: string,
  // One kind of ['shared', 'group', 'solo']
  tourType: BookingTourType,
  // Expected begin date of trip
  depatureDate: string,
  // Reference to Sale model, each Sale is indentified by pk+sk pair
  assigneeId: string
}
