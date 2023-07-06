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
  ) => {
    // Get bookings
    const bookings = await bookingRepository.getListByStatus(tenant, status);

    // Get related items
    let relatedItems;
    if (bookings.length) {
      relatedItems = await bookingRepository.fetchBookingsRelatedItems(tenant, bookings);
      const { leads, customers, tourTemplates } = relatedItems;
      return bookings.map((booking) => {
        const { tourLeadId, customerId, tourTemplateId } = booking;
        const adjustedBooking = { ...booking };
        if (tourLeadId) {
          adjustedBooking.lead = leads.find((lead) => lead.code === tourLeadId);
        }
        if (customerId) {
          adjustedBooking.customer = customers.find((customer) => customer.code === customerId);
        }
        if (tourTemplateId) {
          adjustedBooking.tourTemplate = tourTemplates
            .find((tourTemplate) => tourTemplate.code === tourTemplateId);
        }
        return adjustedBooking;
      });
    }

    return bookings;
  };
}
