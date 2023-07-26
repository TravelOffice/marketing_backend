import { CognitoUser } from '../../models/CognitoUser';

export interface PaymentPendingUseCase {
  invoke: (
    currentUser: CognitoUser,
    bookingId: string,
    waitingExpiredAt: string,
  ) => Promise<string>,
}
