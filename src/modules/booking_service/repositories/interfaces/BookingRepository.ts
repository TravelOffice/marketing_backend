import { Booking } from '../../models/booking/Booking';

export interface BookingRepository {
  create: (tenant: string, booking: Booking) => Promise<Booking>,
  createFromLead: (tenant: string, leadId: string, booking: Booking) => Promise<Booking>,
  getByGivenId: (tenant: string, bookingId: string) => Promise<Booking | undefined>,
  getAll: (tenant: string) => Promise<Array<Booking>>,
  generateCode: (tenant: string) => Promise<string>,
}
