import { bookingRepository } from '../repositories';
import { GetAllBookingUseCase } from './interfaces/GetAllBookingUseCase';
import { Booking } from '../models/booking/Booking';
import { Customer } from '../models/Customer';

export default class GetAllBookingUseCaseImpl implements GetAllBookingUseCase {
  invoke = async (tenant: string) => {
    // Get bookings
    const bookings: Array<Booking> = await bookingRepository.getAll(tenant);

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
          adjustedBooking.tourTemplate = tourTemplates.find(
            (tourTemplate) => tourTemplate.code === tourTemplateId,
          );
        }
        return adjustedBooking;
      });
    }

    return bookings;
  };
}
