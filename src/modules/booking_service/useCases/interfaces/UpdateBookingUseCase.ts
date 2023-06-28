import { Booking } from '../../models/booking/Booking';

export interface UpdateBookingUseCase {
    invoke: (tenant: string,
        bookingId: string,
        booking: Booking,
    ) => Promise<Booking>;
}
