import { bookingRepository } from '../repositories';
import { GetBookingByGivenIdUseCase } from './interfaces/GetBookingByGivenIdUseCase';

export default class GetBookingByGivenIdUseCaseImpl implements GetBookingByGivenIdUseCase {
  /** TODO:
   * User who has admin role can get any booking related to tenant
   * Otherwise, only user who has assigned to booking can get booking with given id
   */
  invoke = async (
    tenant: string,
    bookingId: string,
  ) => bookingRepository.getByGivenId(tenant, bookingId);
}
