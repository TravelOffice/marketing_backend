import { Booking, BookingStatus } from '../../models/Booking';

export interface BookingRepository {
  listByLead: (tenantId: string, leadId: string, status?: BookingStatus) => Promise<Array<Booking>>
}
