import { Booking, BookingStatus } from '../../models/booking/Booking';

export interface BookingRepository {
  listByLead: (tenant: string, leadId: string, status?: BookingStatus) => Promise<Array<Booking>>,
  create: (tenant: string, booking: Booking) => Promise<Booking>,
  createFromLead: (tenant: string, leadId: string, booking: Booking) => Promise<Booking>,
  generateCode: (tenant: string) => Promise<string>,
}
