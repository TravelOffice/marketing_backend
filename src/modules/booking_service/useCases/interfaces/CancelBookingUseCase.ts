import { Booking } from '../../models/booking/Booking';

export interface CancelBookingUseCase {
    invoke: (tenant: string, bookingId: string, reason: string) => Promise<Booking>;
}
