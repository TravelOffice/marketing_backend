import { BookingStatus } from '../models/booking/Booking';
import { bookingRepository } from '../repositories';
import { GetBookingsByStatusUseCase } from './interfaces/GetBookingsByStatusUseCase';

export default class GetBookingsByStatusUseCaseImpl implements GetBookingsByStatusUseCase {
  /**
   * Get list of bookings by given status
   * @param tenant Tenant id
   * @param status Status of booking
   * @returns List of bookings that have given status
   */
  invoke = async (
    tenant: string,
    status: BookingStatus,
  ) => bookingRepository.getListByStatus(tenant, status);
}
