import { CognitoUser } from '../../models/CognitoUser';
import { Booking } from '../../models/booking/Booking';

export interface CancelBookingUseCase {
  invoke: (userInfo: CognitoUser, bookingId: string, reason: string) => Promise<Partial<Booking>>;
}
