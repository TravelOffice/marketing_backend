import { Booking, BookingStatus } from '../../models/booking/Booking';
import { BookingsRelatedItems } from '../../models/booking/BookingsRelatedItems';

export interface BookingRepository {
  create: (tenant: string, booking: Booking) => Promise<Booking>,
  update: (tenant: string, bookingId: string, booking: Booking) => Promise<Booking>,
  createFromLead: (tenant: string, leadId: string, booking: Booking) => Promise<Booking>,
  getByGivenId: (tenant: string, bookingId: string) => Promise<Booking | undefined>,
  getAll: (tenant: string) => Promise<Array<Booking>>,
  getListByStatus: (tenant: string, status: BookingStatus) => Promise<Array<Booking>>,
  generateCode: (tenant: string) => Promise<string>,
  cancel: (tenant: string, bookingId: string, reason: string) => Promise<Booking>,
  fetchBookingsRelatedItems: (tenant: string, bookings: Booking[]) => Promise<BookingsRelatedItems>,
}
