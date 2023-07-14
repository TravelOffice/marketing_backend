import { CognitoUser } from '../../models/CognitoUser';
import { ConfirmBookingDto } from '../../models/dto/ConfirmBookingDto';

export interface ConfirmBookingUseCase {
  invoke: (
    currentUser: CognitoUser,
    bookingId: string,
    dto: ConfirmBookingDto,
  ) => Promise<void>,
}
