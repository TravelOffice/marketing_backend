import { bookingRepository } from '../repositories';
import { GetBookingsByDepartureTourIdUseCase } from './interfaces/GetBookingsByDepartureTourIdUseCase';
import { Customer } from '../models/Customer';

export default class GetBookingsByDepartureTourIdUseCaseImpl
implements GetBookingsByDepartureTourIdUseCase {
  /**
   * Get list of bookings by given departureTourId
   * @param tenant Tenant id
   * @param departureTourId id of departure tour for filtering booking
   * @returns List of bookings that have given departureTourId
   */
  invoke = async (
    tenant: string,
    departureTourId: string,
  ) => {
    // Get bookings
    const bookings = await bookingRepository.getListByDepartureTourId(tenant, departureTourId);

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
          adjustedBooking.customer = customers.find(
            (customer) => customer.code === customerId,
          ) as Partial<Customer>;
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
