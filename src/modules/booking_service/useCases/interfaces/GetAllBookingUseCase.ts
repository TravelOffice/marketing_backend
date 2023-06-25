import { Booking } from '../../models/booking/Booking';

export interface GetAllBookingUseCase {
  invoke: (tenant: string) => Promise<Array<Booking>>;
}
