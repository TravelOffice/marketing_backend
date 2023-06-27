import { Booking } from '../../models/booking/Booking';
import { CreateBookingInput } from '../../models/rawApiData/CreateBookingInput';

export interface CreateBookingUseCase {
    invoke: (currentUserInfo: {
        tenant: string,
        username: string,
        name: any,
    }, newBooking: CreateBookingInput) => Promise<Booking>;
}
