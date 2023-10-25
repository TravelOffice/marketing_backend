import { BookingStatusEnum, statusTransitionRules } from '../models/booking/Booking';
import { bookingRepository } from '../repositories';
import { CancelBookingUseCase } from './interfaces/CancelBookingUseCase';
import logger from '../utils/logger';
import { CognitoUser } from '../models/CognitoUser';
import { PAYMENT_PENDING_RULE } from '../utils/constants';

export default class CancelBookingUseCaseImpl implements CancelBookingUseCase {
  /**
   * Invokes the cancellation of a booking for a specific tenant.
   *
   * @param {CognitoUser} userInfo - The current lambda1 user.
   * @param {string} bookingId - The ID of the booking to cancel.
   * @param {string} reason - The reason for the cancellation.
   * @returns {Promise<Booking>} - A promise that resolves to the canceled booking.
   * @throws {Error} - If the booking information is invalid or the cancellation is not allowed.
   */
  invoke = async (userInfo: CognitoUser, bookingId: string, reason: string) => {
    const { tenant } = userInfo;
    // Retrieve the booking based on the tenantId and bookingId
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);

    // Validate booking information
    if (!booking) {
      throw new Error('Booking does not exist!');
    }

    // Check if the cancellation is allowed based on the booking status and cancellation rules
    if (!statusTransitionRules.includes(`${booking.bookingStatus}-${BookingStatusEnum.CANCELED}`)) {
      throw new Error(`Cannot change status from '${booking.bookingStatus}' to '${BookingStatusEnum.CANCELED}'`);
    }

    // Cancel the booking
    logger.log(`[CancelBookingUseCaseImpl]: Booking ${bookingId} was canceled with the reason '${reason}'`);
    // TODO: notification

    // Delete payment pending event bridge
    if (booking.bookingStatus === BookingStatusEnum.PAYMENT_PENDING) {
      const ruleName = `${tenant}-${bookingId}-${PAYMENT_PENDING_RULE}`;
      await bookingRepository.deletePaymentDeadline(ruleName);
    }

    return bookingRepository.cancel(userInfo, booking, reason);
  };
}
