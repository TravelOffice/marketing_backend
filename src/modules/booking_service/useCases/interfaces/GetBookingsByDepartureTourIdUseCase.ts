import { Booking } from '../../models/booking/Booking';

export interface GetBookingsByDepartureTourIdUseCase {
  invoke: (tenant: string, departureTourId: string) => Promise<Booking[]>;
}
