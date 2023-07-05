import {
  bookingRepository, customerRepository, leadRepository, tourTemplateRepository,
} from '../repositories';
import { GetBookingByGivenIdUseCase } from './interfaces/GetBookingByGivenIdUseCase';

export default class GetBookingByGivenIdUseCaseImpl implements GetBookingByGivenIdUseCase {
  /** TODO:
   * User who has admin role can get any booking related to tenant
   * Otherwise, only user who has assigned to booking can get booking with given id
   */
  invoke = async (
    tenant: string,
    bookingId: string,
  ) => {
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);
    if (booking) {
      const { tourLeadId, customerId, tourTemplateId } = booking;
      if (tourLeadId) booking.lead = await leadRepository.getById(tenant, tourLeadId);
      if (customerId) booking.customer = await customerRepository.get(tenant, customerId);
      if (tourTemplateId) {
        booking.tourTemplate = await tourTemplateRepository.get(tenant, tourTemplateId);
      }
    }
    return booking;
  };
}
