import { Booking } from '../../models/booking/Booking';
import { CreateBookingFromLeadInput } from '../../models/rawApiData/CreateBookingFromLeadInput';

export interface CreateBookingFromLeadUseCase {
  invoke: (currentUserInfo: {
    tenant: string,
    username: string,
    name: any,
  }, newBooking: CreateBookingFromLeadInput) => Promise<Booking>;
}
