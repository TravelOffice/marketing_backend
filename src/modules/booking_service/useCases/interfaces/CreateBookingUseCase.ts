import { Booking } from '../../models/booking/Booking';
import { CreateBookingInput } from '../../models/rawApiData/CreateBookingInput';

export interface CreateBookingUseCase {
    invoke: (tenant: string, newBooking: CreateBookingInput) => Promise<Booking>;
}
