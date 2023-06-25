import { Booking } from '../../models/booking/Booking';

export interface GetBookingByGivenIdUseCase {
  invoke: (tenant: string, bookingId: string) => Promise<Booking | undefined>;
}
