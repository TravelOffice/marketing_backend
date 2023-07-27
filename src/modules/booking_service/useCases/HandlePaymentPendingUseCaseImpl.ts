import { bookingRepository } from '../repositories';
import { HandlePaymentPendingUseCase } from './interfaces/HandlePaymentPendingUseCase';
import { BookingStatusEnum } from '../models/booking/Booking';
import { BOOKING_STATUS_INDEX } from '../utils/constants';

export default class HandlePaymentPendingUseCaseImpl implements HandlePaymentPendingUseCase {
  /**
   * Invokes the function to change the status of a booking to CONFIRMED.
   *
   * @param tenant - The ID of tenant
   * @param bookingId - The ID of the booking to update.
   * @param deadline - The due date for purchase the payment
   * @returns A Promise that resolves when the update is complete.
   * @throws Error if the booking does not exist, the status transition is not allowed,
   * or the departure tour is not found.
   */
  invoke = async (tenant: string, bookingId: string, deadline: string) => {
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);
    if (!booking) throw new Error('Booking does not exist!');
    await bookingRepository.update(tenant, bookingId, {
      bookingStatus: BookingStatusEnum.PAYMENT_PENDING,
      waitingExpiredAt: deadline,
      updatedAt: Date.now(),
      lsi3: `${BOOKING_STATUS_INDEX}#${BookingStatusEnum.PAYMENT_PENDING}`, // <status>,
    });
    return bookingRepository.createPaymentDeadline(tenant, bookingId, deadline);
  };
}
