import { BookingStatusEnum, CHANGING_STATUS_RULES } from '../models/booking/Booking';
import { bookingRepository } from '../repositories';
import { CancelBookingUseCase } from './interfaces/CancelBookingUseCase';
import logger from '../utils/logger';

export default class CancelBookingUseCaseImpl implements CancelBookingUseCase {
  /**
   * Invokes the cancellation of a booking for a specific tenant.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} bookingId - The ID of the booking to cancel.
   * @param {string} reason - The reason for the cancellation.
   * @returns {Promise<Booking>} - A promise that resolves to the canceled booking.
   * @throws {Error} - If the booking information is invalid or the cancellation is not allowed.
   */
  invoke = async (tenantId: string, bookingId: string, reason: string) => {
    // Retrieve the booking based on the tenantId and bookingId
    const booking = await bookingRepository.getByGivenId(tenantId, bookingId);

    // Validate booking information
    if (!booking) {
      throw new Error('Booking does not exist!');
    }

    // Check if the cancellation is allowed based on the booking status and cancellation rules
    if (!CHANGING_STATUS_RULES.includes(`${booking.bookingStatus}-${BookingStatusEnum.CANCELED}`)) {
      throw new Error(`Cannot change status from '${booking.bookingStatus}' to '${BookingStatusEnum.CANCELED}'`);
    }

    // Cancel the booking
    logger.log(`[CancelBookingUseCaseImpl]: Booking ${bookingId} was canceled with the reason '${reason}'`);
    // TODO: notification
    return bookingRepository.cancel(tenantId, bookingId, reason);
  };
}
