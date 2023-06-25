import { Booking, BookingStatus } from '../../models/booking/Booking';

export interface GetBookingListByLeadUseCase {
  invoke: (username: string, leadId: string, status?: BookingStatus) => Promise<Array<Booking>>;
}
