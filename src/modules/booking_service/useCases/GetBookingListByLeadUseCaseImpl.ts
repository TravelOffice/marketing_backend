import { BookingStatus } from '../models/Booking';
import { bookingRepository, userRepository } from '../repositories';
import { GetBookingListByLeadUseCase } from './interfaces/GetBookingListByLeadUseCase';

export default class GetBookingListByLeadUseCaseImpl implements GetBookingListByLeadUseCase {
  /**
   * Use case is used for the user (Employee) to get bookings list created by a Lead and its status.
   * @param username Employee's username
   * @param leadId Lead ID
   * @param status Booking status
   * @returns Promise of bookings list
   */
  invoke = async (username: string, leadId: string, status?: BookingStatus) => {
    const currentUser = await userRepository.getUserAttributes(username);
    if (!currentUser) {
      throw new Error('User does not exist');
    }
    const tenantId = currentUser.tenant;
    return bookingRepository.listByLead(tenantId, leadId, status);
  };
}
