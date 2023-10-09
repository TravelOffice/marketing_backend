import { ConfirmBookingUseCase } from './interfaces/ConfirmBookingUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { bookingRepository, departureTourRepository } from '../repositories';
import {
  Booking, BookingPaymentStatusEnum, BookingStatusEnum, statusTransitionRules,
} from '../models/booking/Booking';
import { ConfirmBookingDto } from '../models/dto/ConfirmBookingDto';
import { BOOKING_STATUS_INDEX, DEPARTURE_TOUR_INDEX, PAYMENT_PENDING_RULE } from '../utils/constants';

export default class ConfirmBookingUseCaseImpl implements ConfirmBookingUseCase {
  /**
   * Invokes the function to change the status of a booking to CONFIRMED.
   *
   * @param currentUser - The current user invoking the function.
   * @param bookingId - The ID of the booking to update.
   * @param dto - The DTO (data transfer object) containing the data for changing
   * the status to CONFIRMED.
   * @returns A Promise that resolves when the update is complete.
   * @throws Error if the booking does not exist, the status transition is not allowed,
   * or the departure tour is not found.
   */
  invoke = async (currentUser: CognitoUser, bookingId: string, dto: ConfirmBookingDto) => {
    const { tenant } = currentUser;
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);
    if (!booking) throw new Error('Booking does not exist!');

    if (!statusTransitionRules.includes(`${booking.bookingStatus}-${BookingStatusEnum.CONFIRMED}`)) {
      throw new Error(`Cannot change status from '${booking.bookingStatus}' to '${BookingStatusEnum.CONFIRMED}'`);
    }

    const { departureTourId, totalPaid } = dto;
    const departureTour = await departureTourRepository.getDepartureTour(tenant, departureTourId);
    if (!departureTour) throw new Error(`Departure tour [${departureTourId}] not found`);

    const dataToUpdate: Partial<Booking> = {
      departureTourId,
      departureTourName: departureTour.name,
      departureDate: departureTour.startDate,
      bookingStatus: BookingStatusEnum.CONFIRMED,
      updatedAt: Date.now(),
      doneAt: Date.now().toString(), // The time that completing payment
      totalPaid,
      paymentStatus: BookingPaymentStatusEnum.PAID,
      lsi3: `${BOOKING_STATUS_INDEX}#${BookingStatusEnum.CONFIRMED}`,
      lsi4: `${DEPARTURE_TOUR_INDEX}#${departureTourId}`,
    };
    const updatedBooking = await bookingRepository.confirm(tenant, bookingId, dataToUpdate);

    // Update filling ratio of departure tour
    const { visitorCount } = departureTour;
    const totalConfirmedPax = (booking.passengers?.length || 0) + departureTour.totalConfirmedPax;
    const departureTourToUpdate = {
      fillingRatio: Math.round((totalConfirmedPax / visitorCount) * 100),
      totalConfirmedPax,
    };
    await departureTourRepository.update(tenant, departureTourId, departureTourToUpdate);

    // Delete payment pending event bridge
    if (booking.bookingStatus === BookingStatusEnum.PAYMENT_PENDING) {
      const ruleName = `${tenant}-${bookingId}-${PAYMENT_PENDING_RULE}`;
      await bookingRepository.deletePaymentDeadline(ruleName);
    }
    return updatedBooking;
  };
}
