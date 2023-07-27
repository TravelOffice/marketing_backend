import { CognitoUser } from '../models/CognitoUser';
import { bookingRepository } from '../repositories';
import { PaymentPendingUseCase } from './interfaces/PaymentPendingUseCase';

export default class PaymentPendingUseCaseImpl implements PaymentPendingUseCase {
  /**
   * Invokes the function to change the status of a booking to CONFIRMED.
   *
   * @param currentUser - The current user invoking the function.
   * @param bookingId - The ID of the booking to update.
   * @param waitingExpiredAt - The due date for purchase the payment
   * @returns A Promise that resolves when the update is complete.
   * @throws Error if the booking does not exist, the status transition is not allowed,
   * or the departure tour is not found.
   */
  invoke = async (currentUser: CognitoUser, bookingId: string, waitingExpiredAt: string) => {
    const { tenant } = currentUser;
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);
    if (!booking) throw new Error('Booking does not exist!');
    return bookingRepository.createPaymentDeadline(tenant, bookingId, waitingExpiredAt);
  };
}
