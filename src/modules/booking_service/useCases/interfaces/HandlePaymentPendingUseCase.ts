import { Booking } from '../../models/booking/Booking';

export interface HandlePaymentPendingUseCase {
  invoke: (
    tenant: string,
    bookingId: string,
    deadline: string,
  ) => Promise<Booking>,
}
