import { Booking, BookingStatus } from '../../models/booking/Booking';

export interface GetBookingsByStatusUseCase {
  invoke: (tenant: string, status: BookingStatus) => Promise<Booking[]>;
}
