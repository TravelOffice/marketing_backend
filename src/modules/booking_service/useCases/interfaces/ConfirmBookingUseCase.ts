import { CognitoUser } from '../../models/CognitoUser';
import { Booking } from '../../models/booking/Booking';
import { ConfirmBookingDto } from '../../models/dto/ConfirmBookingDto';

export interface ConfirmBookingUseCase {
  invoke: (
    currentUser: CognitoUser,
    bookingId: string,
    dto: ConfirmBookingDto,
  ) => Promise<Partial<Booking>>,
}
